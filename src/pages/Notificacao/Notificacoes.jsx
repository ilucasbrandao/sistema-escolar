import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { formatarParaBRL } from "../../utils/format";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';
import utc from "dayjs/plugin/utc"; // <--- 1. IMPORTANTE PARA CORRIGIR DATA
import {
    ChevronLeftIcon,
    MessageCircle,
    AlertTriangle,
    Gift,
    Calendar,
    CheckCircle2,
    BellRing
} from "lucide-react";

dayjs.locale('pt-br');
dayjs.extend(utc); // <--- 2. ATIVANDO O PLUGIN UTC

// --- Componente de Card de Notificação Padronizado ---
const NotificationCard = ({ title, subtitle, value, type, onAction, dateLabel }) => {
    const styles = {
        cobranca: {
            border: "border-l-4 border-l-red-500",
            icon: AlertTriangle,
            iconColor: "text-red-500",
            bg: "bg-red-50",
            hover: "hover:border-red-300"
        },
        aniversario: {
            border: "border-l-4 border-l-pink-500",
            icon: Gift,
            iconColor: "text-pink-500",
            bg: "bg-pink-50",
            hover: "hover:border-pink-300"
        },
        aviso: {
            border: "border-l-4 border-l-blue-500",
            icon: Calendar,
            iconColor: "text-blue-500",
            bg: "bg-blue-50",
            hover: "hover:border-blue-300"
        }
    };

    const style = styles[type] || styles.aviso;
    const Icon = style.icon;

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-100 ${style.border} flex items-center justify-between transition-all hover:shadow-md ${style.hover}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${style.bg}`}>
                    <Icon className={`w-5 h-5 ${style.iconColor}`} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-700 text-sm">{title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        {subtitle}
                        {/* Exibe a data se for passada */}
                        {dateLabel && <span className="font-semibold text-slate-600">• {dateLabel}</span>}
                    </p>
                </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
                {value && <span className="font-bold text-slate-800 text-sm">{value}</span>}
                {onAction && (
                    <button
                        onClick={onAction}
                        className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-xs font-bold bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <MessageCircle className="w-3.5 h-3.5" /> Cobrar
                    </button>
                )}
            </div>
        </div>
    );
};

export function Notificacoes() {
    const navigate = useNavigate();

    // Estados
    const [inadimplentes, setInadimplentes] = useState([]);
    const [aniversariantes, setAniversariantes] = useState([]);

    // Filtros de Data
    const [mes, setMes] = useState(dayjs().month() + 1);
    const [ano, setAno] = useState(dayjs().year());

    const [loading, setLoading] = useState(true);

    // Busca Dados
    useEffect(() => {
        const carregar = async () => {
            setLoading(true);
            try {
                const { data } = await api.get("/dashboard", { params: { mes, ano } });
                setInadimplentes(data.inadimplentes || []);
                setAniversariantes(data.aniversariantes || []);
            } catch (err) {
                console.error("Erro ao carregar notificações:", err);
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, [mes, ano]);

    // Função WhatsApp
    const enviarWhatsappCobranca = (aluno) => {
        const telefone = aluno.telefone ? aluno.telefone.replace(/\D/g, "") : "";

        if (!telefone) {
            alert("Telefone não cadastrado para este aluno.");
            return;
        }

        const primeiroNome = aluno.nome.split(" ")[0];
        const mesExtenso = dayjs().month(mes - 1).format("MMMM");

        const mensagem = `Olá! Tudo bem? Passando para lembrar sobre a mensalidade de *${mesExtenso}* do(a) aluno(a) *${primeiroNome}*. Valor: ${formatarParaBRL(aluno.valor_mensalidade)}. Qualquer dúvida, estamos à disposição! 📚`;

        const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
    };

    return (
        <Container>
            {/* Header com Filtros Estilizados */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <Button onClick={() => navigate("/")} variant="ghost" className="pl-0 text-slate-500 hover:text-slate-800 mb-1">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar ao Menu
                    </Button>
                    <div className="flex items-center gap-2">
                        <BellRing className="w-6 h-6 text-indigo-600" />
                        <Title level={1} className="!mb-0">Central de Notificações</Title>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 ml-8">Acompanhe pendências e eventos importantes.</p>
                </div>

                {/* Filtro de Mês/Ano (Visual Clean) */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                    <select
                        value={mes}
                        onChange={(e) => setMes(Number(e.target.value))}
                        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer py-1 px-2 hover:bg-slate-50 rounded-lg transition"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{dayjs().month(i).format("MMMM")}</option>
                        ))}
                    </select>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <select
                        value={ano}
                        onChange={(e) => setAno(Number(e.target.value))}
                        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer py-1 px-2 hover:bg-slate-50 rounded-lg transition"
                    >
                        {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Coluna 1: Cobranças (Prioridade) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h2 className="font-bold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Pendências Financeiras
                        </h2>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {inadimplentes.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-100">Carregando...</div>
                        ) : inadimplentes.length === 0 ? (
                            <div className="bg-white border border-green-100 rounded-xl p-8 text-center shadow-sm">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-slate-800 font-bold">Tudo em dia!</h3>
                                <p className="text-slate-500 text-sm mt-1">Nenhuma pendência financeira encontrada para este período.</p>
                            </div>
                        ) : (
                            inadimplentes.map((aluno) => (
                                <NotificationCard
                                    key={aluno.id}
                                    type="cobranca"
                                    title={aluno.nome}
                                    subtitle="Mensalidade em aberto"
                                    value={formatarParaBRL(aluno.valor_mensalidade)}
                                    onAction={() => enviarWhatsappCobranca(aluno)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Coluna 2: Aniversariantes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h2 className="font-bold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                            Aniversariantes do Mês
                        </h2>
                        <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {aniversariantes.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-100">Carregando...</div>
                        ) : aniversariantes.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-xl p-8 text-center shadow-sm">
                                <p className="text-slate-400 text-sm">Nenhum aniversariante neste mês.</p>
                            </div>
                        ) : (
                            aniversariantes.map((aluno, idx) => (
                                <NotificationCard
                                    key={idx}
                                    type="aniversario"
                                    title={aluno.nome}
                                    subtitle="Faz aniversário dia"
                                    dateLabel={dayjs.utc(aluno.data_nascimento).format("DD/MM")}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </Container>
    );
}