import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import dayjs from "dayjs";
import { formatarParaBRL } from "../../utils/format";

// Componentes
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import {
    ChevronLeftIcon,
    Eye,
    Calendar,
    Phone,
    User,
    Mail,
    CreditCard,
    X,
    Banknote,
    BookOpen,
    Crown,
    MessageCircle
} from "lucide-react";

// --- Subcomponentes ---

const StatusBadge = ({ status }) => {
    const styles = status === "ativo"
        ? "bg-green-100 text-green-700 border-green-200"
        : "bg-red-100 text-red-700 border-red-200";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles}`}>
            {status}
        </span>
    );
};

// --- Modal de Pagamento ---
const PaymentModal = ({ isOpen, onClose, data, onSendWhatsapp }) => {
    if (!isOpen || !data) return null;

    const anoRef = data.ano_referencia || dayjs(data.data_pagamento).format('YYYY');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Detalhe do Pagamento</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition"><X className="w-5 h-5 text-slate-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Referência</span>
                        <span className="font-medium capitalize">{data.mes_referencia} / {anoRef}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Valor Pago</span>
                        <span className="font-bold text-green-600">{formatarParaBRL(data.valor)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Data Pagamento</span>
                        <span className="font-medium">{data.data_pagamento ? dayjs(data.data_pagamento).format("DD/MM/YYYY") : "-"}</span>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button onClick={onClose} variant="secondary" className="flex-1">Fechar</Button>
                        <Button
                            onClick={() => onSendWhatsapp(data)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white border-none"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" /> Enviar Recibo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Auxiliares ---
function formatarDataLegivel(dataISO) {
    if (!dataISO) return "—";
    return dayjs(dataISO).format("DD/MM/YYYY");
}
function idadeEmAnos(dataNascimentoISO) {
    if (!dataNascimentoISO) return "-";
    return dayjs().diff(dayjs(dataNascimentoISO), 'year');
}
const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Icon className="w-4 h-4" /></div>
        <div><p className="text-xs text-slate-400 font-medium uppercase">{label}</p><p className="text-sm text-slate-700 font-medium break-all">{value || "—"}</p></div>
    </div>
);

// --- Componente Principal ---
export default function VisualizarDados() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        async function getStudentById() {
            try {
                const { data } = await api.get(`/alunos/${id}`);
                setStudent(data);
                setMovimentacoes(data.movimentacoes || []);
            } catch (error) { console.error("Erro:", error); }
        }
        getStudentById();
    }, [id]);

    const handleSendReceipt = (payment) => {
        if (!student.telefone) {
            alert("O aluno não possui telefone cadastrado.");
            return;
        }

        const anoRef = payment.ano_referencia || dayjs(payment.data_pagamento).format('YYYY');
        const phone = student.telefone.replace(/\D/g, '');

        const message = `Olá, *${student.responsavel}*! \n\nConfirmamos o recebimento do pagamento referente ao aluno(a) *${student.nome}*.\n\n💰 Valor: *${formatarParaBRL(payment.valor)}*\n📅 Referência: *${payment.mes_referencia}/${anoRef}*\n✅ Status: Pago\n\nAtenciosamente,\n*Espaço Ao Pé da Letra*`;

        const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (!student) return <div className="p-8 text-center text-gray-500">Carregando perfil...</div>;

    const isPremium = student.plano === 'premium';

    return (
        <Container>
            {/* Navegação */}
            <div className="flex items-center justify-between mb-8">
                <Button onClick={() => navigate("/alunos")} variant="ghost" className="text-gray-600 pl-0 hover:bg-transparent hover:text-blue-600 transition">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar para lista
                </Button>
                <div className="text-right">
                    <span className="text-xs text-gray-400 uppercase font-bold">Matrícula</span>
                    <p className="text-lg font-mono text-gray-700">#{student.id.toString().padStart(4, '0')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUNA 1: Cartão do Aluno */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden ${isPremium ? 'border-2 border-amber-400 ring-4 ring-amber-50' : 'border border-slate-100'}`}>
                        <div className={`absolute top-0 left-0 w-full h-2 ${isPremium ? 'bg-gradient-to-r from-amber-300 to-yellow-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}></div>

                        {isPremium && (
                            <div className="absolute top-4 right-4 animate-pulse">
                                <Crown className="text-amber-500 fill-amber-100 w-6 h-6" />
                            </div>
                        )}

                        <div className="flex flex-col items-center text-center mb-6 mt-2">

                            {/* --- ÁREA DA FOTO DO ALUNO --- */}
                            {student.foto_url ? (
                                // Se tiver foto (vinda do app dos pais)
                                <div className={`w-24 h-24 rounded-full mb-4 border-4 shadow-sm overflow-hidden flex items-center justify-center bg-slate-50 ${isPremium ? 'border-amber-200' : 'border-white'}`}>
                                    <img
                                        src={student.foto_url}
                                        alt={student.nome}
                                        className="w-full h-full object-cover"
                                    // Adiciona um timestamp falso se quiser evitar cache: src={`${student.foto_url}?t=${Date.now()}`}
                                    />
                                </div>
                            ) : (
                                // Se NÃO tiver foto (Mostra inicial)
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-4 shadow-sm ${isPremium ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-500 border-white'}`}>
                                    {student.nome.charAt(0)}
                                </div>
                            )}
                            {/* ----------------------------- */}

                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {student.nome}
                            </h2>

                            {isPremium && (
                                <span className="mt-1 mb-2 px-3 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200 flex items-center gap-1">
                                    <Crown size={10} className="fill-current" /> Aluno Premium
                                </span>
                            )}

                            <p className="text-sm text-gray-500 mb-3">{student.serie}</p>
                            <StatusBadge status={student.status} />
                        </div>

                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <InfoRow icon={User} label="Responsável" value={student.responsavel} />
                            <InfoRow icon={Mail} label="Email" value={student.email_responsavel || "N/A"} />
                            <InfoRow icon={Phone} label="Contato" value={student.telefone} />
                            <InfoRow icon={Calendar} label="Nascimento" value={`${formatarDataLegivel(student.data_nascimento)} (${idadeEmAnos(student.data_nascimento)} anos)`} />
                            <InfoRow icon={Calendar} label="Matrícula" value={formatarDataLegivel(student.data_matricula)} />
                        </div>

                        <div className="w-full mt-6 pt-6 border-t border-slate-100">
                            <Button
                                onClick={() => navigate(`/diario/${id}`)}
                                className={`w-full text-white flex justify-center items-center gap-2 shadow-sm transition-all ${isPremium ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                <BookOpen size={20} />
                                Abrir Diário Escolar
                            </Button>
                            <p className="text-xs text-center text-gray-400 mt-2">
                                Ver histórico e lançar feedbacks
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-2 opacity-80">
                            <CreditCard className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase tracking-wider">Plano {isPremium ? "Premium" : "Mensal"}</span>
                        </div>
                        <p className="text-3xl font-bold">{formatarParaBRL(student.valor_mensalidade)}</p>
                        <p className="text-sm text-slate-400 mt-1">Vencimento todo dia {student.dia_vencimento || '05'}</p>
                    </div>
                </div>

                {/* COLUNA 2: Histórico */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <Title level={3} className="!mb-0">Histórico de Pagamentos</Title>
                            <Button onClick={() => navigate(`/lancamentos/receitas?alunoId=${student.id}`)} className="bg-green-600 hover:bg-green-700 text-white flex gap-2 w-full sm:w-auto justify-center">
                                <Banknote className="w-4 h-4" /> Novo Pagamento
                            </Button>
                        </div>

                        {movimentacoes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                <CreditCard className="w-12 h-12 mb-2 opacity-50" />
                                <p>Nenhum pagamento registrado.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Referência</th>
                                            <th className="px-4 py-3">Valor</th>
                                            <th className="px-4 py-3 text-center">Situação</th>
                                            <th className="px-4 py-3 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {movimentacoes.map((mov) => (
                                            <tr key={mov.id || mov.id_mensalidade} className="hover:bg-slate-50 transition group">
                                                <td className="px-4 py-3 font-medium text-slate-700">
                                                    <span className="capitalize">{mov.mes_referencia}</span>
                                                    <span className="text-slate-400"> / {mov.ano_referencia || dayjs(mov.data_pagamento).format('YYYY')}</span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{formatarParaBRL(mov.valor)}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Pago
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right flex justify-end gap-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSendReceipt(mov); }}
                                                        className="text-slate-400 hover:text-green-600 transition p-2 bg-slate-50 hover:bg-green-50 rounded-lg"
                                                        title="Enviar Recibo no WhatsApp"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedPayment(mov)}
                                                        className="text-slate-400 hover:text-blue-600 transition p-2 bg-slate-50 hover:bg-blue-50 rounded-lg"
                                                        title="Ver Detalhes"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PaymentModal
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
                data={selectedPayment}
                onSendWhatsapp={handleSendReceipt}
            />
        </Container>
    );
}