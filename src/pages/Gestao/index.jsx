import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, Paragraph, Title } from "../../components/Container";
import { ChevronLeftIcon, LayoutDashboard, UserRoundPlus } from "lucide-react";
import { formatarParaBRL } from "../../utils/format";
import { formatarDataLegivel } from "../../utils/date";

export function Lancamentos() {
    const navigate = useNavigate();
    const [lancamentos, setLancamentos] = useState([]);
    const [resumo, setResumo] = useState({ total_receitas: 0, total_despesas: 0, saldo: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [loading, setLoading] = useState(true);

    // Define mês atual ao carregar
    useEffect(() => {
        const hoje = dayjs();
        const inicioMes = hoje.startOf("month").format("YYYY-MM-DD");
        const fimMes = hoje.endOf("month").format("YYYY-MM-DD");

        setInicio(inicioMes);
        setFim(fimMes);
    }, []);

    // Carrega lançamentos sempre que datas mudam
    useEffect(() => {
        carregarLancamentos();
    }, [inicio, fim]);

    const carregarLancamentos = async () => {
        setLoading(true);
        try {
            const params = {};
            if (inicio) params.inicio = inicio;
            if (fim) params.fim = fim;

            const { data } = await api.get("/lancamentos", { params });
            setLancamentos(data.lancamentos);
            setResumo(data.resumo);
        } catch (error) {
            console.error("Erro ao carregar lançamentos:", error);
        } finally {
            setLoading(false);
        }
    };

    const alterarMes = (delta) => {
        const novoMes = dayjs(inicio).add(delta, "month");
        setInicio(novoMes.startOf("month").format("YYYY-MM-DD"));
        setFim(novoMes.endOf("month").format("YYYY-MM-DD"));
    };

    const filteredLancamentos = lancamentos.filter((l) =>
        (l.descricao || l.tipo || "").toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => b.origem_id - a.origem_id)
        ;

    const gerarDescricao = (l) => {
        if (l.descricao) return l.descricao;
        if (l.tipo === "receita") return "Mensalidade";
        if (l.tipo === "despesa") return "Despesa";
        return "-";
    };

    return (
        <Container>
            {/* Botões */}
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </Button>
                <Title level={1} className="text-xl font-bold text-slate-800">Lançamentos</Title>
                <div className="flex gap-2">

                    <Button variant="pastelGreen" onClick={() => navigate("/dashboard")}>
                        <LayoutDashboard className="w-5 h-5" />Dashboard
                    </Button>
                </div>
            </div>

            <Paragraph muted className="text-sm text-slate-600 mb-4">
                Visualize os lançamentos financeiros por mês.
            </Paragraph>

            {/* Filtros */}
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 flex-wrap">
                <div className="flex gap-2">
                    <Button onClick={() => alterarMes(-1)}>← Mês anterior</Button>
                    <Button onClick={() => alterarMes(1)}>Próximo mês →</Button>
                </div>
                <div className="mb-4 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 flex-wrap">

                    <input
                        type="date"
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                        className="p-2 border rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        value={fim}
                        onChange={(e) => setFim(e.target.value)}
                        className="p-2 border rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <Button onClick={carregarLancamentos} className="text-sm">Filtrar</Button>
                </div>
                <input
                    type="text"
                    placeholder="Pesquisar por descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Resumo */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-md shadow-sm text-sm text-center">
                <div>
                    <h3 className="font-medium text-slate-700">Receitas</h3>
                    <p className="text-green-600 font-semibold">{formatarParaBRL(resumo.total_receitas)}</p>
                </div>
                <div>
                    <h3 className="font-medium text-slate-700">Despesas</h3>
                    <p className="text-red-600 font-semibold">{formatarParaBRL(resumo.total_despesas)}</p>
                </div>
                <div>
                    <h3 className="font-medium text-slate-700">Saldo</h3>
                    <p className={`${resumo.saldo >= 0 ? "text-green-600" : "text-red-600"} font-semibold`}>
                        {formatarParaBRL(resumo.saldo)}
                    </p>
                </div>
            </div>

            {/* Tabela */}
            {loading ? (
                <Paragraph muted>Carregando lançamentos...</Paragraph>
            ) : filteredLancamentos.length === 0 ? (
                <Paragraph muted>Nenhum lançamento encontrado.</Paragraph>
            ) : (
                <table className="w-full border-collapse text-sm mb-4">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 font-medium">
                            <th className="border px-2 py-1">Tipo</th>
                            <th className="border px-2 py-1">Descrição</th>
                            <th className="border px-2 py-1">Entrada</th>
                            <th className="border px-2 py-1">Saída</th>
                            <th className="border px-2 py-1">Valor</th>
                            <th className="border px-2 py-1">Data</th>
                            <th className="border px-2 py-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLancamentos.map((l) => (
                            <tr
                                key={l.lancamento_id}
                                className="hover:bg-slate-50 cursor-pointer"
                                onClick={() => navigate(`/lancamentos/${l.origem_id}`)}
                            >
                                <td className={`border px-2 py-1 font-semibold ${l.tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
                                    {l.tipo}
                                </td>
                                <td className="border px-2 py-1">{gerarDescricao(l)}</td>
                                <td className="border px-2 py-1">{l.nome_aluno || "-"}</td>
                                <td className="border px-2 py-1">{l.nome_professor || "-"}</td>
                                <td className="border px-2 py-1">{formatarParaBRL(l.valor)}</td>
                                <td className="border px-2 py-1">{l.data ? formatarDataLegivel(l.data) : "-"}</td>
                                <td className="border px-2 py-1">{l.status || "Finalizada"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Container>
    );
}
