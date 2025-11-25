import { useState, useEffect } from "react";
import api from "../../services/api";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import {
    ChevronLeftIcon,
    UserRoundPlus,
    Lock,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Wallet,
    TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatarParaBRL } from "../../utils/format";
import dayjs from "dayjs";
import { toast } from "react-toastify";

// Recharts para Gráficos
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// --- Subcomponentes ---

const KPICard = ({ title, value, icon: Icon, colorClass, subtext }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
    </div>
);

// --- Componente Principal ---

export function Dashboard() {
    const navigate = useNavigate();

    // Controle de Data
    const [ano, setAno] = useState(dayjs().year());
    const [mes, setMes] = useState(dayjs().month() + 1);

    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);

    const carregarDashboard = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/dashboard", { params: { mes, ano } });
            setDados(data);
        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao carregar dados.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDashboard();
    }, [mes, ano]);

    const alterarMes = (delta) => {
        const novo = dayjs(`${ano}-${mes}-01`).add(delta, "month");
        setMes(novo.month() + 1);
        setAno(novo.year());
    };

    const handleFecharCaixa = async () => {
        const senhaCorreta = import.meta.env.VITE_SENHA_FECHAMENTO || "JulianneKelly2025";
        // O ideal seria usar um Modal customizado aqui, mas vamos manter o prompt por simplicidade por enquanto
        const senha = prompt("🔒 Digite a senha administrativa para fechar o caixa:");

        if (senha !== senhaCorreta) {
            toast.error("Senha incorreta.");
            return;
        }

        try {
            const { data } = await api.post("/fechar-caixa-mes", { senha, mes, ano });
            toast.success(`Caixa fechado! Saldo Final: ${formatarParaBRL(data.fechamento.saldo_final)}`);
            carregarDashboard();
        } catch (error) {
            toast.error("Erro ao fechar mês.");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-slate-500">Atualizando indicadores...</div>;
    if (!dados) return <div className="p-8 text-center">Erro ao carregar dados.</div>;

    // Preparar dados para o gráfico de Pizza (Inadimplência)
    const totalAlunos = (dados.inadimplentes.length + dados.alunos_ativos); // Aproximação
    const dadosInadimplencia = [
        { name: 'Em Dia', value: dados.alunos_ativos - dados.inadimplentes.length },
        { name: 'Inadimplentes', value: dados.inadimplentes.length },
    ];
    const COLORS_INADIMPLENCIA = ['#22c55e', '#ef4444'];

    // Dados para Gráfico de Previsão vs Realizado
    // Como o dashboard retorna valores soltos, montamos um array simples
    const dadosFinanceiros = [
        {
            name: 'Receitas',
            Previsto: dados.saldo_previsto_mensalidades,
            Realizado: dados.saldo_caixa > 0 ? dados.saldo_caixa : 0 // Simplificação visual
        },
        {
            name: 'Despesas',
            Previsto: dados.saldo_previsto_salarios,
            Realizado: 0 // Se você tiver o dado real de despesas, coloque aqui
        }
    ];

    return (
        <Container className="bg-slate-50/50 min-h-screen pb-10">
            {/* Header com Navegação de Data */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <Button onClick={() => navigate("/")} variant="ghost" className="pl-0 text-slate-500 hover:text-slate-800 mb-1">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                    </Button>
                    <h1 className="text-2xl font-bold text-slate-800">Painel de Controle</h1>
                </div>

                {/* Seletor de Mês Central */}
                <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                    <button onClick={() => alterarMes(-1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <span className="px-6 font-bold text-slate-700 w-40 text-center capitalize">
                        {dayjs(`${ano}-${mes}-01`).format("MMMM YYYY")}
                    </span>
                    <button onClick={() => alterarMes(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><ChevronLeftIcon className="w-5 h-5 rotate-180" /></button>
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => navigate("/alunos/cadastrar")} className="bg-blue-600 text-white">
                        <UserRoundPlus className="w-5 h-5 mr-2" /> Novo Aluno
                    </Button>
                </div>
            </div>

            {/* Linha de KPIs */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                    title="Saldo em Caixa"
                    value={formatarParaBRL(dados.saldo_caixa)}
                    icon={Wallet}
                    colorClass={dados.saldo_caixa >= 0 ? "bg-green-500" : "bg-red-500"}
                    subtext="Acumulado do mês"
                />
                <KPICard
                    title="Previsão Receita"
                    value={formatarParaBRL(dados.saldo_previsto_mensalidades)}
                    icon={TrendingUp}
                    colorClass="bg-blue-500"
                    subtext="Se todos pagarem"
                />
                <KPICard
                    title="Novas Matrículas"
                    value={dados.matriculados_mes_atual}
                    icon={UserRoundPlus}
                    colorClass="bg-purple-500"
                    subtext="Neste mês"
                />
                <KPICard
                    title="Professores"
                    value={dados.professores_ativos}
                    icon={UserRoundPlus}
                    colorClass="bg-orange-400"
                    subtext="Ativos"
                />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUNA ESQUERDA (2/3): Gráficos e Financeiro */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Gráfico Comparativo */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <Title level={3} className="mb-4">Previsão vs Realizado</Title>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dadosFinanceiros}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="Previsto" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} />
                                    <Bar dataKey="Realizado" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lista de Inadimplentes (Agora mais bonita) */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <h3 className="font-bold text-slate-700">Inadimplentes ({dados.inadimplentes.length})</h3>
                            </div>
                            {dados.inadimplentes.length > 0 && (
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">Ação Necessária</span>
                            )}
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            {dados.inadimplentes.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-2 opacity-50" />
                                    <p>Parabéns! Todos os alunos estão em dia.</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Aluno</th>
                                            <th className="px-6 py-3">Valor Pendente</th>
                                            <th className="px-6 py-3 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {dados.inadimplentes.map((aluno) => (
                                            <tr key={aluno.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-3 font-medium text-slate-700">{aluno.nome}</td>
                                                <td className="px-6 py-3 text-red-600 font-bold">{formatarParaBRL(aluno.valor_mensalidade)}</td>
                                                <td className="px-6 py-3 text-right">
                                                    <button
                                                        onClick={() => navigate(`/alunos/${aluno.id}`)}
                                                        className="text-blue-600 hover:underline text-xs"
                                                    >
                                                        Cobrar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA (1/3): Operacional */}
                <div className="space-y-8">

                    {/* Gráfico Pizza de Status */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <Title level={3} className="mb-2">Status de Pagamentos</Title>
                        <div className="h-[200px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dadosInadimplencia}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dadosInadimplencia.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_INADIMPLENCIA[index]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Texto Central */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                                <span className="text-2xl font-bold text-slate-700">{dados.alunos_ativos}</span>
                                <span className="text-xs text-slate-400">Total</span>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Fechamento de Mês (Destacado) */}
                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Lock className="w-24 h-24" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Fechamento Mensal</h3>
                        <p className="text-slate-300 text-sm mb-4">
                            Garanta que todos os lançamentos de {dayjs(`${ano}-${mes}-01`).format("MMMM")} foram realizados antes de fechar.
                        </p>
                        <Button
                            onClick={handleFecharCaixa}
                            className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold border-none"
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Fechar Caixa
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full mt-2 text-slate-300 hover:text-white hover:bg-white/10"
                            onClick={() => navigate(`/relatorio?mes=${mes}&ano=${ano}`)}
                        >
                            Ver Relatório Completo
                        </Button>
                    </div>

                </div>
            </div>
        </Container>
    );
}