import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, Paragraph, Title } from "../../components/Container";
import { ChevronLeftIcon, UserRoundPlus } from "lucide-react";
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

    // Carregar lançamentos e resumo do backend
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

    useEffect(() => {
        carregarLancamentos();
    }, []);

    // Filtrar por descrição apenas (datas já filtradas no backend)
    const filteredLancamentos = lancamentos.filter((l) =>
        (l.descricao || l.tipo || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const gerarDescricao = (l) => {
        if (l.descricao) return l.descricao;
        if (l.tipo === "receita") return "Mensalidade";
        if (l.tipo === "despesa") return "Despesa";
        return "-";
    };

    return (
        <Container>
            {/* Botões */}
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" />
                </Button>
                <Button onClick={() => navigate("/lancamentos/cadastrar")}>
                    <UserRoundPlus className="w-5 h-5" />
                </Button>
            </div>

            <div className="text-center">
                <Title level={1}>Histórico de Lançamentos</Title>
                <Paragraph muted className="mt-4">
                    Informações sobre os lançamentos serão exibidas aqui:
                </Paragraph>

                {/* Filtros */}
                <div className="mt-6 mb-4 flex justify-end gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Pesquisar por descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md w-72 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    />
                    <input
                        type="date"
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                        className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        value={fim}
                        onChange={(e) => setFim(e.target.value)}
                        className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button onClick={carregarLancamentos}>Filtrar</Button>
                </div>

                {/* Resumo do período */}
                <div className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm flex justify-around">
                    <div>
                        <h3 className="font-semibold">Receitas</h3>
                        <p className="text-green-600">{formatarParaBRL(resumo.total_receitas)}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Despesas</h3>
                        <p className="text-red-600">{formatarParaBRL(resumo.total_despesas)}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Saldo</h3>
                        <p className={`${resumo.saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatarParaBRL(resumo.saldo)}
                        </p>
                    </div>
                </div>

                {/* Tabela de lançamentos */}
                {loading ? (
                    <Paragraph muted>Carregando lançamentos...</Paragraph>
                ) : filteredLancamentos.length === 0 ? (
                    <Paragraph muted>Nenhum lançamento encontrado.</Paragraph>
                ) : (
                    <table className="w-full border-collapse border mb-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-2 py-1">Tipo</th>
                                <th className="border px-2 py-1">Descrição</th>
                                <th className="border px-2 py-1">Aluno</th>
                                <th className="border px-2 py-1">Professor</th>
                                <th className="border px-2 py-1">Valor</th>
                                <th className="border px-2 py-1">Data</th>
                                <th className="border px-2 py-1">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLancamentos.map((l) => (
                                <tr
                                    key={l.lancamento_id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => navigate(`/lancamentos/${l.origem_id}`)}
                                >
                                    <td
                                        className={`border px-2 py-1 font-semibold ${l.tipo === "receita" ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
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
            </div>
        </Container>
    );
}
