import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import {
    ChevronLeftIcon,
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    Calendar,
    Search,
    Filter,
    ArrowRight,
    ArrowLeft
} from "lucide-react";
import { formatarParaBRL } from "../../utils/format";

// Subcomponente para os Cards do Topo
const SummaryCard = ({ title, value, type, icon: Icon }) => {
    // Definição de cores baseada no tipo (Estilo Glass/Clean)
    const styles = {
        receita: "bg-emerald-50 text-emerald-700 border-emerald-100",
        despesa: "bg-red-50 text-red-700 border-red-100",
        saldo: value >= 0 ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-orange-50 text-orange-700 border-orange-100"
    };

    const currentStyle = styles[type] || styles.saldo;

    return (
        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-all hover:shadow-md ${currentStyle}`}>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">{title}</p>
                <h3 className="text-2xl font-bold">{formatarParaBRL(value)}</h3>
            </div>
            <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm shadow-sm">
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

    const filteredLancamentos = useMemo(() => {
        return lancamentos
            .filter((l) =>
                (l.descricao || l.tipo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (l.nome_aluno || "").toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => dayjs(b.data).diff(dayjs(a.data)));
    }, [lancamentos, searchTerm]);

    const getParticipante = (l) => {
        if (l.tipo === "receita") return l.nome_aluno || <span className="text-slate-400 italic">Aluno não identificado</span>;
        if (l.tipo === "despesa") return l.nome_professor || <span className="text-slate-400">Despesa Geral</span>;
        return "-";
    };

    return (
        <Container>
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <Button onClick={() => navigate("/")} variant="ghost" className="pl-0 text-slate-500 hover:text-slate-800 mb-1">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar ao Menu
                    </Button>
                    <Title level={1} className="!mb-0">Fluxo de Caixa</Title>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        onClick={() => navigate("receitas")}
                        className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 border-none h-11"
                    >
                        <ArrowUpCircle className="w-5 h-5 mr-2" />
                        Nova Receita
                    </Button>
                    <Button
                        onClick={() => navigate("despesas")}
                        className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 border-none h-11"
                    >
                        <ArrowDownCircle className="w-5 h-5 mr-2" />
                        Nova Despesa
                    </Button>
                </div>
            </div>

            {/* Painel de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    title="Saldo Líquido"
                    value={resumo.saldo}
                    type="saldo"
                    icon={Wallet}
                />
            </div>

            {/* Barra de Ferramentas Unificada */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-2 items-center">

                {/* Navegação Rápida de Mês */}
                <div className="flex items-center bg-slate-50 rounded-xl p-1 w-full lg:w-auto justify-between border border-slate-100">
                    <button onClick={() => alterarMes(-1)} className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition hover:shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="px-6 text-sm font-bold text-slate-700 capitalize min-w-[140px] text-center">
                        {dayjs(inicio).format("MMMM YYYY")}
                    </span>
                    <button onClick={() => alterarMes(1)} className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition hover:shadow-sm">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-px h-8 bg-slate-200 hidden lg:block mx-2"></div>

                {/* Filtro de Data Personalizada */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full lg:w-auto hover:border-blue-300 transition-colors group">
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="date"
                            value={inicio}
                            onChange={e => setInicio(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer w-28 font-medium text-center"
                        />
                        <span className="text-slate-300">até</span>
                        <input
                            type="date"
                            value={fim}
                            onChange={e => setFim(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer w-28 font-medium text-center"
                        />
                    </div>
                </div>

                {/* Busca */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por descrição, aluno ou professor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all text-sm"
                    />
                </div>
            </div>

            {/* Tabela de Lançamentos */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 w-32">Data</th>
                                <th className="px-6 py-4">Descrição</th>
                                <th className="px-6 py-4">Origem / Destino</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                                <th className="px-6 py-4 text-center w-24">Tipo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 animate-pulse">
                                        Carregando movimentações...
                                    </td>
                                </tr>
                            ) : filteredLancamentos.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="p-3 bg-slate-50 rounded-full">
                                                <Filter className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <span>Nenhum lançamento encontrado neste período.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLancamentos.map((l) => (
                                    <tr key={l.lancamento_id} className="hover:bg-blue-50/30 transition duration-150 group">
                                        <td className="px-6 py-4 font-medium text-slate-500">
                                            {dayjs(l.data).format("DD/MM/YYYY")}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {l.descricao || <span className="text-slate-400 italic">Sem descrição</span>}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {getParticipante(l)}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold font-mono ${l.tipo === "receita" ? "text-emerald-600" : "text-red-600"
                                            }`}>
                                            {l.tipo === "receita" ? "+ " : "- "}
                                            {formatarParaBRL(l.valor)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${l.tipo === "receita"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-red-50 text-red-700 border-red-100"
                                                }`}>
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