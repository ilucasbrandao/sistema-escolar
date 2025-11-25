import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import {
    ChevronLeftIcon,
    CircleDollarSign,
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    Calendar,
    Search,
    Filter,
    ArrowRightLeft
} from "lucide-react";
import { formatarParaBRL } from "../../utils/format";

// Subcomponente para os Cards do Topo
const SummaryCard = ({ title, value, type, icon: Icon }) => {
    // Definição de cores baseada no tipo
    const styles = {
        receita: "bg-green-50 text-green-700 border-green-100",
        despesa: "bg-red-50 text-red-700 border-red-100",
        saldo: value >= 0 ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-red-50 text-red-700 border-red-100"
    };

    const currentStyle = styles[type] || styles.saldo;

    return (
        <div className={`p-4 rounded-xl border shadow-sm flex items-center justify-between ${currentStyle}`}>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{title}</p>
                <h3 className="text-2xl font-bold">{formatarParaBRL(value)}</h3>
            </div>
            <div className="p-3 bg-white/50 rounded-full">
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
};

export function Lancamentos() {
    const navigate = useNavigate();
    const [lancamentos, setLancamentos] = useState([]);
    const [resumo, setResumo] = useState({ total_receitas: 0, total_despesas: 0, saldo: 0 });
    const [searchTerm, setSearchTerm] = useState("");

    // Estados de datas
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [loading, setLoading] = useState(true);

    // Inicialização
    useEffect(() => {
        const hoje = dayjs();
        setInicio(hoje.startOf("month").format("YYYY-MM-DD"));
        setFim(hoje.endOf("month").format("YYYY-MM-DD"));
    }, []);

    // Busca de dados
    useEffect(() => {
        if (inicio && fim) carregarLancamentos();
    }, [inicio, fim]);

    const carregarLancamentos = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/lancamentos", { params: { inicio, fim } });
            setLancamentos(data.lancamentos);
            setResumo(data.resumo);
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    const alterarMes = (delta) => {
        const novoMes = dayjs(inicio).add(delta, "month");
        setInicio(novoMes.startOf("month").format("YYYY-MM-DD"));
        setFim(novoMes.endOf("month").format("YYYY-MM-DD"));
    };

    // Uso de useMemo para performance na filtragem
    const filteredLancamentos = useMemo(() => {
        return lancamentos
            .filter((l) =>
                (l.descricao || l.tipo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (l.nome_aluno || "").toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => dayjs(b.data).diff(dayjs(a.data))); // Mais recentes primeiro
    }, [lancamentos, searchTerm]);

    // Função auxiliar para decidir quem mostrar na tabela
    const getParticipante = (l) => {
        if (l.tipo === "receita") return l.nome_aluno || "Aluno não identificado";
        if (l.tipo === "despesa") return l.nome_professor || "Despesa Geral";
        return "-";
    };

    return (
        <Container>
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <Button onClick={() => navigate("/")} variant="ghost" className="pl-0 text-slate-500 hover:text-slate-800 mb-2">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                    </Button>
                    <Title level={1}>Gestão Financeira</Title>
                    <p className="text-slate-500 text-sm">Acompanhe o fluxo de caixa da escola</p>
                </div>

                <div className="flex gap-2">
                    {/* Botão de Atalho para Receita */}
                    <Button
                        onClick={() => navigate("receitas")}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200"
                    >
                        <ArrowUpCircle className="w-5 h-5 mr-2" />
                        Nova Receita
                    </Button>
                    {/* Botão de Atalho para Despesa */}
                    <Button
                        onClick={() => navigate("despesas")}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200"
                    >
                        <ArrowDownCircle className="w-5 h-5 mr-2" />
                        Nova Despesa
                    </Button>
                </div>
            </div>

            {/* Painel de Resumo (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <SummaryCard
                    title="Entradas"
                    value={resumo.total_receitas}
                    type="receita"
                    icon={ArrowUpCircle}
                />
                <SummaryCard
                    title="Saídas"
                    value={resumo.total_despesas}
                    type="despesa"
                    icon={ArrowDownCircle}
                />
                <SummaryCard
                    title="Saldo Atual"
                    value={resumo.saldo}
                    type="saldo"
                    icon={Wallet}
                />
            </div>

            {/* Barra de Ferramentas (Filtros e Busca) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Navegação de Mês */}
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button onClick={() => alterarMes(-1)} className="p-2 hover:bg-white rounded-md text-slate-600 transition shadow-sm">
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-semibold text-slate-700 min-w-[140px] text-center capitalize">
                        {dayjs(inicio).format("MMMM YYYY")}
                    </span>
                    <button onClick={() => alterarMes(1)} className="p-2 hover:bg-white rounded-md text-slate-600 transition shadow-sm">
                        <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                    </button>
                </div>

                {/* Filtro de Data Personalizada e Busca */}
                <div className="flex flex-1 w-full md:w-auto gap-3 flex-col md:flex-row">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm gap-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-fit">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />

                        <div className="flex items-center gap-1">
                            <input
                                type="date"
                                value={inicio}
                                onChange={e => setInicio(e.target.value)}
                                className="bg-transparent text-xs sm:text-sm font-medium text-slate-600 outline-none cursor-pointer p-0 border-none focus:ring-0"
                                required
                            />
                            <span className="text-slate-300 text-xs px-1">até</span>
                            <input
                                type="date"
                                value={fim}
                                onChange={e => setFim(e.target.value)}
                                className="bg-transparent text-xs sm:text-sm font-medium text-slate-600 outline-none cursor-pointer p-0 border-none focus:ring-0"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar lançamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Tabela Profissional */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Descrição</th>
                                <th className="px-6 py-4">Origem / Destino</th>
                                <th className="px-6 py-4">Valor</th>
                                <th className="px-6 py-4 text-center">Tipo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                        Carregando movimentações...
                                    </td>
                                </tr>
                            ) : filteredLancamentos.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                                        <Filter className="w-8 h-8 text-slate-300" />
                                        <span>Nenhum lançamento encontrado neste período.</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredLancamentos.map((l) => (
                                    <tr key={l.lancamento_id} className="hover:bg-slate-50 transition duration-150">
                                        <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                                            {dayjs(l.data).format("DD/MM/YYYY")}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800">
                                            {l.descricao || "Sem descrição"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {getParticipante(l)}
                                        </td>
                                        <td className={`px-6 py-4 font-bold whitespace-nowrap ${l.tipo === "receita" ? "text-green-600" : "text-red-600"
                                            }`}>
                                            {l.tipo === "receita" ? "+ " : "- "}
                                            {formatarParaBRL(l.valor)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                                                ${l.tipo === "receita" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {l.tipo}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>
    );
}