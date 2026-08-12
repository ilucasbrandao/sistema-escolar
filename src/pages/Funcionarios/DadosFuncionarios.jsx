import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import dayjs from "dayjs";
import { formatarParaBRL } from "../../utils/format";

// Componentes da Aplicação
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";

// Ícones
import {
    ChevronLeftIcon,
    Eye,
    Calendar,
    Phone,
    User,
    MapPin,
    Briefcase,
    Banknote,
    X,
    MessageCircle,
    GraduationCap,
    Mail,
    Users,
    Search,
    CheckCircle2,
    TrendingUp,
    History
} from "lucide-react";

// --- Formatação por Extenso do Mês ---
const formatarMesExtenso = (mes, dataPagamento) => {
    if (!mes) return dataPagamento ? dayjs(dataPagamento).format("MMMM") : "—";
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const numMes = Number(mes);
    if (!isNaN(numMes) && numMes >= 1 && numMes <= 12) {
        return meses[numMes - 1];
    }
    return String(mes);
};

// --- Modal Compacto de Detalhe de Pagamento ---
const PaymentModal = ({ isOpen, onClose, data, onSendWhatsapp }) => {
    if (!isOpen || !data) return null;

    const anoRef = data.ano_referencia || dayjs(data.data_pagamento).format("YYYY");
    const mesNome = formatarMesExtenso(data.mes_referencia, data.data_pagamento);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-slate-100">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200/80 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        Detalhes do Pagamento
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200/60 rounded-full transition text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                        <span className="text-slate-500 text-xs font-medium">Mês de Referência</span>
                        <span className="font-semibold text-slate-800 text-sm capitalize">
                            {mesNome} / {anoRef}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                        <span className="text-slate-500 text-xs font-medium">Valor Pago</span>
                        <span className="font-bold text-emerald-600 text-base">
                            {formatarParaBRL(data.valor)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                        <span className="text-slate-500 text-xs font-medium">Data do Pagamento</span>
                        <span className="font-medium text-slate-700 text-sm">
                            {data.data_pagamento
                                ? dayjs(data.data_pagamento).format("DD/MM/YYYY")
                                : "—"}
                        </span>
                    </div>

                    <div className="pt-3 flex gap-2.5">
                        <Button onClick={onClose} variant="ghost" className="flex-1 text-slate-600 hover:bg-slate-100">
                            Fechar
                        </Button>
                        <Button
                            onClick={() => onSendWhatsapp(data)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm flex items-center justify-center gap-2 text-xs font-semibold"
                        >
                            <MessageCircle className="w-4 h-4" /> Comprovante
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Auxiliares de Datas
function formatarDataLegivel(dataISO) {
    if (!dataISO) return "—";
    return dayjs(dataISO).format("DD/MM/YYYY");
}

function idadeEmAnos(dataNascimentoISO) {
    if (!dataNascimentoISO) return "-";
    return dayjs().diff(dayjs(dataNascimentoISO), "year");
}

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 py-1.5">
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
            <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-xs text-slate-700 font-semibold truncate">{value || "—"}</p>
        </div>
    </div>
);

export default function VisualizarDadosFuncionario() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [teacher, setTeacher] = useState(null);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);

    // Controle da Aba Ativa (salarios | alunos)
    const [activeTab, setActiveTab] = useState("salarios");

    // Filtros internos
    const [buscaAluno, setBuscaAluno] = useState("");
    const [anoFiltro, setAnoFiltro] = useState(dayjs().year().toString());

    useEffect(() => {
        async function getTeacherById() {
            try {
                const { data } = await api.get(`/professores/${id}`);
                setTeacher(data);
                setMovimentacoes(data.movimentacoes || data.despesas || []);
            } catch (error) {
                console.error("❌ Erro ao buscar professor:", error);
                alert("Não foi possível carregar os dados do professor(a).");
                navigate("/professores");
            }
        }
        getTeacherById();
    }, [id, navigate]);

    // Anos disponíveis no histórico para o filtro
    const anosDisponiveis = useMemo(() => {
        const anos = new Set();
        anos.add(dayjs().year().toString());
        movimentacoes.forEach((m) => {
            const ano = m.ano_referencia || dayjs(m.data_pagamento).format("YYYY");
            if (ano) anos.add(ano.toString());
        });
        return Array.from(anos).sort((a, b) => b - a);
    }, [movimentacoes]);

    // Filtragem de Pagamentos por Ano
    const movimentacoesFiltradas = useMemo(() => {
        return movimentacoes.filter((m) => {
            const ano = (m.ano_referencia || dayjs(m.data_pagamento).format("YYYY")).toString();
            return anoFiltro === "todos" || ano === anoFiltro;
        });
    }, [movimentacoes, anoFiltro]);

    // CÁLCULO DE RESUMO FINANCEIRO (KPIs)
    const totalPagoAno = useMemo(() => {
        return movimentacoesFiltradas.reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
    }, [movimentacoesFiltradas]);

    // Filtragem local da lista de alunos tutelados
    const alunosFiltrados = useMemo(() => {
        if (!teacher?.alunos) return [];
        return teacher.alunos.filter((aluno) =>
            aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) ||
            (aluno.serie && aluno.serie.toLowerCase().includes(buscaAluno.toLowerCase()))
        );
    }, [teacher, buscaAluno]);

    // Disparo de Comprovante no WhatsApp
    const handleSendReceipt = (payment) => {
        if (!teacher?.telefone) {
            alert("O professor não possui telefone cadastrado.");
            return;
        }

        const anoRef = payment.ano_referencia || dayjs(payment.data_pagamento).format("YYYY");
        const mesNome = formatarMesExtenso(payment.mes_referencia, payment.data_pagamento);
        const phone = teacher.telefone.replace(/\D/g, "");

        const message = `Olá, *${teacher.nome}*! \n\nSegue o comprovante de pagamento do seu salário.\n\n💰 Valor: *${formatarParaBRL(
            payment.valor
        )}*\n📅 Referência: *${mesNome}/${anoRef}*\n✅ Status: Pago\n\nAtenciosamente,\n*Administração - Espaço Ao Pé da Letra*`;

        window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, "_blank");
    };

    if (!teacher) {
        return (
            <Container className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-xs font-medium">Carregando dados...</span>
                </div>
            </Container>
        );
    }

    const emailProfessor = teacher.email || teacher.user?.email;

    return (
        <Container className="pb-16">
            {/* Cabeçalho Limpo */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    onClick={() => navigate("/professores")}
                    variant="ghost"
                    className="text-slate-500 hover:text-slate-800 p-0 hover:bg-transparent transition flex items-center text-xs font-semibold"
                >
                    <ChevronLeftIcon className="w-4 h-4 mr-1" /> Voltar para lista
                </Button>

                <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        ID Funcional
                    </span>
                    <p className="text-sm font-mono font-bold text-slate-700">
                        #{teacher.id.toString().padStart(4, "0")}
                    </p>
                </div>
            </div>

            {/* Grid Principal Layout (1 Coluna Esquerda | 2 Colunas Direita) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ================================================================= */}
                {/* ESQUERDA: PERFIL DO PROFESSOR (4 Colunas no Desktop)              */}
                {/* ================================================================= */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                        <div className="flex flex-col items-center text-center mb-5 mt-1">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-3 border-2 shadow-xs bg-slate-100 text-slate-600 border-white ring-2 ring-slate-100">
                                {teacher.nome.charAt(0)}
                            </div>

                            <h2 className="text-lg font-bold text-slate-800 leading-snug">
                                {teacher.nome}
                            </h2>

                            <p className="text-xs text-slate-500 font-medium mt-0.5 mb-2">
                                {teacher.nivel_ensino || "Docente"}
                            </p>

                            <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${teacher.status === "ativo"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                        : "bg-rose-50 text-rose-700 border-rose-200/80"
                                    }`}
                            >
                                {teacher.status}
                            </span>
                        </div>

                        {/* Informações Pessoais Compactas */}
                        <div className="space-y-1 border-t border-slate-100 pt-4">
                            <InfoRow icon={Mail} label="E-mail" value={emailProfessor} />
                            <InfoRow icon={Phone} label="Contato" value={teacher.telefone} />
                            <InfoRow icon={MapPin} label="Endereço" value={teacher.endereco} />
                            <InfoRow
                                icon={Calendar}
                                label="Nascimento"
                                value={`${formatarDataLegivel(teacher.data_nascimento)} (${idadeEmAnos(
                                    teacher.data_nascimento
                                )} anos)`}
                            />
                            <InfoRow
                                icon={Briefcase}
                                label="Contratação"
                                value={formatarDataLegivel(teacher.data_contratacao)}
                            />
                            <InfoRow icon={GraduationCap} label="Turno" value={teacher.turno} />
                        </div>
                    </div>

                    {/* Card Resumo do Salário Base */}
                    <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1 opacity-80">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Salário Base
                            </span>
                            <Banknote className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {formatarParaBRL(teacher.salario)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                            Valor cadastrado no contrato atual
                        </p>
                    </div>
                </div>

                {/* ================================================================= */}
                {/* DIREITA: ÁREA DE INTERAÇÃO COM ABAS (8 Colunas no Desktop)        */}
                {/* ================================================================= */}
                <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* BARRA DE NAVEGAÇÃO DE ABAS (TABS) */}
                    <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-2">
                        <button
                            onClick={() => setActiveTab("salarios")}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "salarios"
                                    ? "bg-white text-blue-600 shadow-xs border border-slate-200/80"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                                }`}
                        >
                            <History className="w-4 h-4" />
                            <span>Histórico Salarial</span>
                            <span className="ml-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">
                                {movimentacoes.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab("alunos")}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "alunos"
                                    ? "bg-white text-blue-600 shadow-xs border border-slate-200/80"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Alunos Acompanhados</span>
                            <span className="ml-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">
                                {teacher.alunos?.length || 0}
                            </span>
                        </button>
                    </div>

                    {/* CONTEÚDO DA ABA 1: HISTÓRICO SALARIAL */}
                    {activeTab === "salarios" && (
                        <div className="p-5 space-y-4">

                            {/* Controles do Topo (KPIs + Filtro por Ano + Botão Lançar) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                                        Total Pago ({anoFiltro === "todos" ? "Geral" : anoFiltro})
                                    </span>
                                    <span className="text-base font-bold text-slate-800">
                                        {formatarParaBRL(totalPagoAno)}
                                    </span>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                                            Filtrar por Ano
                                        </span>
                                        <select
                                            value={anoFiltro}
                                            onChange={(e) => setAnoFiltro(e.target.value)}
                                            className="bg-transparent text-xs font-bold text-blue-600 outline-none cursor-pointer"
                                        >
                                            <option value="todos">Todos os Anos</option>
                                            {anosDisponiveis.map((ano) => (
                                                <option key={ano} value={ano}>
                                                    Ano {ano}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    onClick={() =>
                                        navigate(`/lancamentos/despesas?tipo=salario&profId=${teacher.id}`)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 h-full"
                                >
                                    <Banknote className="w-4 h-4" /> Lançar Pagamento
                                </Button>
                            </div>

                            {/* Tabela de Histórico Salarial com Scroll Fixo Integrado */}
                            {movimentacoesFiltradas.length === 0 ? (
                                <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <Banknote className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-xs font-medium text-slate-500">
                                        Nenhum pagamento registrado no período selecionado.
                                    </p>
                                </div>
                            ) : (
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-50 text-slate-400 uppercase font-bold sticky top-0 z-10 border-b border-slate-200 text-[10px] tracking-wider">
                                                <tr>
                                                    <th className="px-4 py-3">Mês / Referência</th>
                                                    <th className="px-4 py-3">Valor</th>
                                                    <th className="px-4 py-3 text-center">Status</th>
                                                    <th className="px-4 py-3 text-right">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {movimentacoesFiltradas.map((mov) => {
                                                    const mesNome = formatarMesExtenso(
                                                        mov.mes_referencia,
                                                        mov.data_pagamento
                                                    );
                                                    const anoRef =
                                                        mov.ano_referencia ||
                                                        dayjs(mov.data_pagamento).format("YYYY");

                                                    return (
                                                        <tr
                                                            key={mov.id_despesa || mov.id}
                                                            className="hover:bg-slate-50/80 transition"
                                                        >
                                                            <td className="px-4 py-3 font-semibold text-slate-800">
                                                                <span className="capitalize">{mesNome}</span>
                                                                <span className="text-slate-400 text-[11px] font-normal"> / {anoRef}</span>
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-slate-700">
                                                                {formatarParaBRL(mov.valor)}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                                    Pago
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button
                                                                        onClick={() => handleSendReceipt(mov)}
                                                                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                                        title="Enviar Comprovante WhatsApp"
                                                                    >
                                                                        <MessageCircle className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setSelectedPayment(mov)}
                                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                                        title="Ver Detalhes"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CONTEÚDO DA ABA 2: LISTA DE ALUNOS TUTELADOS */}
                    {activeTab === "alunos" && (
                        <div className="p-5 space-y-4">

                            {/* Barra de Busca de Aluno dentro da Aba */}
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Buscar aluno por nome ou série..."
                                    value={buscaAluno}
                                    onChange={(e) => setBuscaAluno(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                />
                                {buscaAluno && (
                                    <button
                                        onClick={() => setBuscaAluno("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Lista em Grid Limita de Alunos (Máximo 380px com Scroll Interno) */}
                            {!teacher.alunos || teacher.alunos.length === 0 ? (
                                <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-xs font-medium text-slate-500">
                                        Nenhum aluno está vinculado a este professor no momento.
                                    </p>
                                </div>
                            ) : alunosFiltrados.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-6">
                                    Nenhum aluno encontrado com a busca "{buscaAluno}".
                                </p>
                            ) : (
                                <div className="max-h-[360px] overflow-y-auto pr-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {alunosFiltrados.map((aluno) => (
                                            <div
                                                key={aluno.id}
                                                onClick={() => navigate(`/alunos/${aluno.id}`)}
                                                className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl flex items-center justify-between cursor-pointer transition group"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 group-hover:border-blue-300 group-hover:text-blue-600 transition shrink-0">
                                                        {aluno.nome.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition">
                                                            {aluno.nome}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-slate-400">
                                                            {aluno.serie || "Série não informada"} • {aluno.turno || "Turno n/a"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Eye className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition shrink-0 ml-2" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalhe de Pagamento */}
            <PaymentModal
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
                data={selectedPayment}
                onSendWhatsapp={handleSendReceipt}
            />
        </Container>
    );
}