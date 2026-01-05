import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast } from "react-toastify";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
    ChevronLeftIcon,
    ChevronRight,
    Lock,
    AlertCircle,
    CheckCircle2,
    Wallet,
    TrendingUp,
    Cake,
    ArrowRight,
    UserRoundPlus
} from "lucide-react";

import api from "../../services/api";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { formatarParaBRL } from "../../utils/format";

dayjs.extend(utc);

/* --- Subcomponentes --- */
const KPICard = ({ title, value, icon: Icon, colorClass, subtext }) => (
    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm flex items-start justify-between transition-all hover:shadow-md">
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorClass} text-white shadow-sm`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

export function Dashboard() {
    const navigate = useNavigate();

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
        const senha = prompt("🔒 Digite a senha administrativa para fechar o caixa:");

        if (senha !== senhaCorreta) {
            toast.error("Senha incorreta.");
            return;
        }

        try {
            const { data } = await api.post("/fechar-caixa-mes", { senha, mes, ano });
            toast.success(`Caixa fechado! Saldo: ${formatarParaBRL(data.fechamento.saldo_final)}`);
            carregarDashboard();
        } catch (error) {
            toast.error("Erro ao fechar mês.");
        }
    };

    if (loading) return (
        <Container className="flex items-center justify-center">
            <div className="animate-pulse text-slate-400 font-medium">Carregando indicadores...</div>
        </Container>
    );

    if (!dados) return (
        <Container>
            <div className="text-center py-10 text-slate-500">Não foi possível carregar os dados.</div>
        </Container>
    );

    const dadosInadimplencia = [
        { name: 'Em Dia', value: dados.alunos_ativos - (dados.inadimplentes?.length || 0) },
        { name: 'Inadimplentes', value: dados.inadimplentes?.length || 0 },
    ];
    const COLORS_INADIMPLENCIA = ['#10b981', '#ef4444'];

    const dadosFinanceiros = [
        {
            name: 'Receitas',
            Previsto: dados.saldo_previsto_mensalidades || 0,
            Realizado: dados.saldo_caixa > 0 ? dados.saldo_caixa : 0
        },
        {
            name: 'Despesas',
            Previsto: dados.saldo_previsto_salarios || 0,
            Realizado: 0
        }
    ];

    const aniversariantesOrdenados = dados.aniversariantes?.sort((a, b) => {
        return dayjs(a.data_nascimento).date() - dayjs(b.data_nascimento).date();
    }) || [];

    return (
        <Container className="pb-10">
            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex flex-col gap-1">
                    <Button onClick={() => navigate("/")} variant="ghost" className="pl-0 text-slate-500 hover:text-slate-800 w-fit">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar ao Menu
                    </Button>
                    <Title level={2} className="!mb-0">Painel de Controle</Title>
                </div>

                <div className="w-full md:w-auto flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-1 min-w-[280px]">
                    <button onClick={() => alterarMes(-1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="px-4 font-bold text-slate-700 capitalize text-sm sm:text-base">
                        {dayjs(`${ano}-${mes}-01`).format("MMMM YYYY")}
                    </span>
                    <button onClick={() => alterarMes(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* --- KPIs --- */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <KPICard
                    title="Saldo em Caixa"
                    value={formatarParaBRL(dados.saldo_caixa)}
                    icon={Wallet}
                    colorClass={dados.saldo_caixa >= 0 ? "bg-emerald-500" : "bg-red-500"}
                    subtext="Acumulado do mês"
                />
                <KPICard
                    title="Previsão Receita"
                    value={formatarParaBRL(dados.saldo_previsto_mensalidades)}
                    icon={TrendingUp}
                    colorClass="bg-blue-500"
                    subtext="Potencial total"
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
                    subtext="Equipe ativa"
                />
            </section>

            {/* --- Grid Principal --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Coluna Esquerda (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Gráfico Barras */}
                    <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700">Fluxo Financeiro</h3>
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Previsão vs Real</span>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dadosFinanceiros} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="Previsto" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar dataKey="Realizado" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lista Inadimplentes (Altura Minima para equilibrar com a direita) */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px] flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <h3 className="font-bold text-slate-800">Pendências ({dados.inadimplentes?.length || 0})</h3>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[400px] p-0">
                            {(!dados.inadimplentes || dados.inadimplentes.length === 0) ? (
                                <div className="p-10 text-center flex flex-col items-center justify-center h-full">
                                    <div className="bg-green-100 p-4 rounded-full mb-3">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <p className="text-slate-600 font-medium">Tudo certo!</p>
                                    <p className="text-slate-400 text-sm">Nenhum pagamento pendente.</p>
                                </div>
                            ) : (
                                <>
                                    <table className="hidden md:table w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">Aluno</th>
                                                <th className="px-6 py-3">Valor</th>
                                                <th className="px-6 py-3 text-right">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dados.inadimplentes.map((aluno) => (
                                                <tr key={aluno.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-700">{aluno.nome}</td>
                                                    <td className="px-6 py-4 text-red-600 font-bold">{formatarParaBRL(aluno.valor_mensalidade)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => navigate(`/alunos/${aluno.id}`)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            Ver Aluno
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="md:hidden p-4 space-y-3">
                                        {dados.inadimplentes.map((aluno) => (
                                            <div key={aluno.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{aluno.nome}</p>
                                                    <p className="text-red-600 font-bold text-sm mt-1">{formatarParaBRL(aluno.valor_mensalidade)}</p>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/alunos/${aluno.id}`)}
                                                    className="p-2 bg-white rounded-full text-blue-600 shadow-sm border border-slate-100"
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Coluna Direita (1/3) - Espaçamento mais apertado (space-y-4) */}
                <div className="space-y-4 lg:space-y-4">

                    {/* Gráfico Pizza Compacto */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <Title level={3} className="!mb-0 !border-none !pb-0 text-center w-full text-base">Pagamentos</Title>
                        <div className="h-[160px] w-full relative mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dadosInadimplencia}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {dadosInadimplencia.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_INADIMPLENCIA[index]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col pb-6">
                                <span className="text-xl font-bold text-slate-800">{dados.alunos_ativos}</span>
                            </div>
                        </div>
                    </div>

                    {/* Aniversariantes */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 border-b border-slate-50 pb-2">
                            <div className="p-1.5 bg-pink-100 rounded-lg">
                                <Cake className="w-4 h-4 text-pink-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700 leading-none text-sm">Aniversariantes</h3>
                            </div>
                        </div>

                        <div className="max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                            {aniversariantesOrdenados.length > 0 ? (
                                <ul className="space-y-2">
                                    {aniversariantesOrdenados.map((aluno) => (
                                        <li key={aluno.id} className="flex justify-between items-center text-xs group hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-white group-hover:shadow-sm">
                                                    {aluno.nome.charAt(0)}
                                                </div>
                                                <span className="text-slate-600 font-medium truncate max-w-[120px]">{aluno.nome}</span>
                                            </div>
                                            <span className="font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-md text-[10px]">
                                                {dayjs.utc(aluno.data_nascimento).format('DD/MM')}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-slate-400 text-xs">Nenhum aniversário.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card de Fechamento (Vertical e Compacto) */}
                    <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-orange-50 rounded-lg">
                                    <Lock className="w-4 h-4 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">Fechamento</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Aberto</span>
                        </div>

                        <p className="text-slate-500 text-xs mb-4 leading-snug">
                            Confira os lançamentos de <strong>{dayjs(`${ano}-${mes}-01`).format("MMMM")}</strong>.
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="ghost"
                                className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs h-9 px-0"
                                onClick={() => navigate(`/relatorio?mes=${mes}&ano=${ano}`)}
                            >
                                Relatório
                            </Button>

                            <Button
                                onClick={handleFecharCaixa}
                                className="w-full bg-slate-800 text-white hover:bg-slate-900 border-none text-xs h-9 shadow-md px-0"
                            >
                                <Lock className="w-3 h-3 mr-1" />
                                Fechar
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </Container>
    );
}