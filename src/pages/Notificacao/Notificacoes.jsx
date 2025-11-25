import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { formatarParaBRL } from "../../utils/format";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';
import {
    ChevronLeftIcon,
    MessageCircle,
    AlertCircle,
    Gift,
    Calendar,
    CheckCircle2
} from "lucide-react";

dayjs.locale('pt-br');

// --- Componente de Card de Notificação ---
const NotificationCard = ({ title, subtitle, value, type, onAction }) => {
    const styles = {
        cobranca: { border: "border-l-4 border-l-red-500", icon: AlertCircle, iconColor: "text-red-500", bg: "bg-red-50" },
        aniversario: { border: "border-l-4 border-l-pink-500", icon: Gift, iconColor: "text-pink-500", bg: "bg-pink-50" },
        aviso: { border: "border-l-4 border-l-blue-500", icon: Calendar, iconColor: "text-blue-500", bg: "bg-blue-50" }
    };

    const style = styles[type] || styles.aviso;
    const Icon = style.icon;

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 ${style.border} flex items-center justify-between hover:shadow-md transition-all`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${style.bg}`}>
                    <Icon className={`w-5 h-5 ${style.iconColor}`} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-700 text-sm">{title}</h4>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
                {value && <span className="font-bold text-slate-800 text-sm">{value}</span>}
                {onAction && (
                    <button
                        onClick={onAction}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-bold bg-green-50 px-2 py-1 rounded-md transition"
                    >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
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
    const [mes, setMes] = useState(dayjs().month() + 1);
    const [ano, setAno] = useState(dayjs().year());
    const [loading, setLoading] = useState(true);

    // Busca Dados (Reaproveitando a rota do dashboard ou criando uma específica)
    useEffect(() => {
        const carregar = async () => {
            setLoading(true);
            try {
                // DICA: Você pode criar uma rota '/notificacoes/geral' no backend que traz tudo
                // Por enquanto, vou simular usando a rota de dashboard que já traz aniversariantes e inadimplentes
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

    // Função para Gerar Link do WhatsApp
    const enviarWhatsappCobranca = (aluno) => {
        // Formata o telefone (remove caracteres não numéricos)
        // ATENÇÃO: O backend precisa retornar o telefone do aluno na lista de inadimplentes!
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

    const enviarWhatsappAniversario = (aluno) => {
        // Mesma lógica, mas mensagem de parabéns
        // const telefone = ...
        // const mensagem = "Parabéns! Feliz aniversário..."
        alert("Funcionalidade de Parabéns em breve! (Precisa do telefone na lista)");
    };

    return (
        <Container>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <Button onClick={() => navigate("/")} variant="ghost" className="pl-0 text-slate-500 mb-1">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                    </Button>
                    <Title level={1}>Central de Notificações</Title>
                    <p className="text-sm text-slate-500">Gerencie avisos e cobranças do mês.</p>
                </div>

                {/* Filtro Compacto */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    <select
                        value={mes}
                        onChange={(e) => setMes(Number(e.target.value))}
                        className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer py-1"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{dayjs().month(i).format("MMMM")}</option>
                        ))}
                    </select>
                    <span className="text-slate-300 mx-1">|</span>
                    <select
                        value={ano}
                        onChange={(e) => setAno(Number(e.target.value))}
                        className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer py-1"
                    >
                        {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Coluna 1: Cobranças (Prioridade) */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <h2 className="font-bold text-slate-700 uppercase text-sm tracking-wide">Pendências Financeiras</h2>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-sm text-slate-400">Carregando...</p>
                        ) : inadimplentes.length === 0 ? (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-green-700 font-medium text-sm">Tudo em dia por aqui!</p>
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

                {/* Coluna 2: Social e Avisos */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="font-bold text-slate-700 uppercase text-sm tracking-wide">Aniversariantes</h2>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-sm text-slate-400">Carregando...</p>
                        ) : aniversariantes.length === 0 ? (
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-6 text-center">
                                <p className="text-slate-500 text-sm">Nenhum aniversariante este mês.</p>
                            </div>
                        ) : (
                            aniversariantes.map((aluno, idx) => (
                                <NotificationCard
                                    key={idx} // Use ID se tiver
                                    type="aniversario"
                                    title={aluno.nome}
                                    subtitle={`Dia ${dayjs(aluno.data_nascimento).format("DD/MM")}`}
                                // onAction={() => enviarWhatsappAniversario(aluno)} // Opcional
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </Container>
    );
}