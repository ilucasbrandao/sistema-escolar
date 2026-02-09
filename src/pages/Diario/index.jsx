import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import {
    ArrowLeft,
    Plus,
    Calendar,
    CheckCircle,
    X,
    User,
    BookOpen,
    Brain,
    Image as ImageIcon,
    UploadCloud,
    Trash2,
    Pencil,
    Eye,
    MessageSquare,
    Star,
    FileText
} from "lucide-react";

export default function Diario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sending, setSending] = useState(false);

    // Controle de Edição
    const [editingId, setEditingId] = useState(null);

    // Controle de Upload
    const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Formulário
    const initialFormState = {
        bimestre: "1º Bimestre",
        pedagogico: {
            leitura: "Em desenvolvimento",
            escrita: "Em desenvolvimento",
            foco: "Em desenvolvimento",
            comportamento: "Em desenvolvimento",
        },
        psico: {
            atencao_memoria: "",
            interacao_social: "",
            regulacao_emocional: "",
            parecer_geral: "",
            habilidades_cognitivas: "",
            coordenacao_motora: "",
            raciocinio_logico: ""
        },
        fotos: [],
        observacao: ""
    };

    const [form, setForm] = useState(initialFormState);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const canManage = user.role === "admin" || user.role === "professor";
    const isResponsavel = user.role === "responsavel";

    // Buscar dados
    async function loadData() {
        try {
            const res = await api.get(`/feedbacks/aluno/${id}`);
            setFeedbacks(res.data);
        } catch (error) {
            if (error.response?.status === 403) navigate("/");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadData(); }, [id]);

    // --- FUNÇÕES DE FOTO ---
    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setArquivosSelecionados(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    }

    function removeNewFile(index) {
        setArquivosSelecionados(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }

    function removeExistingPhoto(urlToRemove) {
        setForm(prev => ({
            ...prev,
            fotos: prev.fotos.filter(url => url !== urlToRemove)
        }));
    }

    // --- AÇÕES DO CRUD ---
    function handleOpenNew() {
        setForm(initialFormState);
        setArquivosSelecionados([]);
        setPreviewUrls([]);
        setEditingId(null);
        setIsModalOpen(true);
    }

    function handleOpenEdit(item) {
        setForm({
            bimestre: item.bimestre,
            pedagogico: item.avaliacao_pedagogica || initialFormState.pedagogico,
            psico: item.avaliacao_psico || initialFormState.psico,
            fotos: item.fotos || [],
            observacao: item.observacao || ""
        });
        setArquivosSelecionados([]);
        setPreviewUrls([]);
        setEditingId(item.id);
        setIsModalOpen(true);
    }

    async function handleExcluir(feedbackId) {
        if (!window.confirm("Tem certeza que deseja excluir este relatório?")) return;
        try {
            await api.delete(`/feedbacks/${feedbackId}`);
            toast.success("Relatório excluído.");
            setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
        } catch (error) {
            toast.error("Erro ao excluir.");
        }
    }

    async function handleSalvar(e) {
        e.preventDefault();
        setSending(true);

        try {
            const formData = new FormData();
            formData.append("aluno_id", id);
            formData.append("bimestre", form.bimestre);

            formData.append("avaliacao_pedagogica", JSON.stringify(form.pedagogico));
            formData.append("avaliacao_psico", JSON.stringify(form.psico));

            formData.append("observacao", form.observacao);

            formData.append("fotos_existentes", JSON.stringify(form.fotos));

            arquivosSelecionados.forEach(file => {
                formData.append("imagens", file);
            });

            const config = {
                headers: { "Content-Type": "multipart/form-data" }
            };

            if (editingId) {
                await api.put(`/feedbacks/${editingId}`, formData, config);
                toast.success("Relatório atualizado!");
            } else {
                await api.post("/feedbacks", formData, config);
                toast.success("Relatório criado!");
            }

            setIsModalOpen(false);
            loadData();

        } catch (error) {
            console.error(error);

            // Tratamento específico para arquivo muito grande
            if (error.response?.data?.error === "File too large") {
                toast.error("Uma das fotos é muito grande! O limite é 20MB.");
            }
            // Tratamento para outros erros conhecidos
            else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            }
            // Erro genérico
            else {
                toast.error("Erro ao salvar relatório.");
            }
        } finally {
            setSending(false);
        }
    }

    async function handleCiente(feedbackId) {
        try {
            await api.patch(`/feedbacks/ler/${feedbackId}`);
            setFeedbacks(prev => prev.map(item => item.id === feedbackId ? { ...item, lido_pelos_pais: true } : item));
            toast.success("Confirmado!");
        } catch (error) { toast.error("Erro ao confirmar leitura."); }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">

            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-indigo-600 mb-2 gap-1 font-medium transition-colors">
                        <ArrowLeft size={18} /> Voltar
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">Diário Escolar</h1>
                    <p className="text-slate-500 text-sm mt-1">Acompanhamento pedagógico e comportamental.</p>
                </div>
                {canManage && (
                    <Button onClick={handleOpenNew} className="bg-indigo-600 hover:bg-indigo-700 text-white flex gap-2 shadow-lg shadow-indigo-200 border-none transition-all">
                        <Plus size={20} /> Novo Relatório
                    </Button>
                )}
            </div>

            {/* Timeline de Relatórios */}
            <main className="max-w-5xl mx-auto space-y-8 pb-20">
                {loading ? (
                    <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600"></div></div>
                ) : feedbacks.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Nenhum relatório encontrado</h3>
                        <p className="text-slate-500 text-sm mt-2">Os relatórios de desenvolvimento aparecerão aqui.</p>
                    </div>
                ) : (
                    feedbacks.map((item) => (
                        <div key={item.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${item.lido_pelos_pais ? 'border-slate-200' : 'border-indigo-200 ring-2 ring-indigo-50'}`}>

                            {/* Header do Card */}
                            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-sm shadow-indigo-200">
                                        {item.bimestre || "Relatório Geral"}
                                    </div>
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                        <Calendar size={14} /> {dayjs(item.created_at).format("DD/MM/YYYY")}
                                    </span>
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                        <User size={14} /> {item.autor?.nome || "Professor Desconhecido"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {item.lido_pelos_pais ? (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 border border-green-100">
                                            <CheckCircle size={12} /> Ciente
                                        </span>
                                    ) : (
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                                            <Star size={10} fill="currentColor" /> Novo
                                        </span>
                                    )}

                                    {canManage && (
                                        <div className="flex items-center gap-1 pl-3 ml-1 border-l border-slate-200">
                                            <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"><Pencil size={16} /></button>
                                            <button onClick={() => handleExcluir(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Corpo do Relatório */}
                            <div className="p-6">
                                {/* Linha 1: Pedagógico (Grid Horizontal) */}
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                                        <BookOpen size={14} /> Desempenho Pedagógico
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {item.avaliacao_pedagogica && Object.entries(item.avaliacao_pedagogica).map(([key, value]) => (
                                            <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                                <span className="block text-xs text-slate-400 uppercase font-bold mb-1">{key}</span>
                                                <span className={`text-sm font-semibold ${value === 'Precisa de atenção' ? 'text-red-500' : 'text-slate-700'}`}>
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Linha 2: Psicopedagógico (Grid) */}
                                {item.avaliacao_psico && Object.values(item.avaliacao_psico).some(v => v) && (
                                    <div className="mb-6">
                                        <h3 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                                            <Brain size={14} /> Parecer Psicopedagógico
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {Object.entries(item.avaliacao_psico).map(([key, value]) => value && (
                                                <div key={key} className="bg-pink-50/30 p-3 rounded-lg border border-pink-100">
                                                    <span className="block text-xs text-pink-400 uppercase font-bold mb-1">{key.replace(/_/g, ' ')}</span>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Linha 3: Obs + Fotos */}
                                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                    {/* Observação (ocupa 2/3 se tiver foto, ou tudo) */}
                                    <div className={`${item.fotos?.length > 0 ? 'md:col-span-2' : 'md:col-span-3'}`}>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                                            <MessageSquare size={14} /> Observações Gerais
                                        </h4>
                                        <div className="text-sm text-slate-600 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                                            {item.observacao || "Sem observações adicionais."}
                                        </div>
                                    </div>

                                    {/* Fotos */}
                                    {item.fotos && item.fotos.length > 0 && (
                                        <div className="md:col-span-1">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                                                <ImageIcon size={14} /> Galeria ({item.fotos.length})
                                            </h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {item.fotos.map((foto, idx) => (
                                                    <a key={idx} href={foto} target="_blank" rel="noreferrer" className="aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden hover:opacity-80 transition block relative">
                                                        <img src={foto} className="w-full h-full object-cover" alt="Atividade" onError={(e) => { e.target.src = "https://placehold.co/100x100?text=IMG"; }} />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Responsável */}
                            {!item.lido_pelos_pais && isResponsavel && (
                                <div className="bg-indigo-50 px-6 py-3 border-t border-indigo-100 text-center">
                                    <Button onClick={() => handleCiente(item.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto shadow-sm">
                                        <CheckCircle size={16} className="mr-2" /> Confirmar Leitura
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </main>

            {/* --- MODAL DE EDIÇÃO --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

                        {/* Header Fixo */}
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
                            <div>
                                <h3 className="font-bold text-lg">{editingId ? "Editar Relatório" : "Novo Relatório"}</h3>
                                <p className="text-indigo-200 text-xs">Preencha os campos abaixo com atenção.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition"><X size={20} /></button>
                        </div>

                        {/* Corpo com Scroll */}
                        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50/50">

                            {/* 1. SELEÇÃO DE BIMESTRE */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Referência Bimestral</label>
                                <select
                                    className="w-full md:w-1/3 bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={form.bimestre}
                                    onChange={e => setForm({ ...form, bimestre: e.target.value })}
                                >
                                    <option>1º Bimestre</option>
                                    <option>2º Bimestre</option>
                                    <option>3º Bimestre</option>
                                    <option>4º Bimestre</option>
                                </select>
                            </div>

                            {/* 2. AVALIAÇÃO PEDAGÓGICA (GRID HORIZONTAL) */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-indigo-700 text-sm uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                                    <BookOpen size={18} /> Avaliação Pedagógica
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.keys(form.pedagogico).map((campo) => (
                                        <div key={campo} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <label className="block text-xs font-bold text-slate-500 mb-2 capitalize text-center">{campo}</label>
                                            <select
                                                className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs focus:border-indigo-500 outline-none"
                                                value={form.pedagogico[campo]}
                                                onChange={e => setForm({ ...form, pedagogico: { ...form.pedagogico, [campo]: e.target.value } })}
                                            >
                                                <option>Excelente</option>
                                                <option>Bom</option>
                                                <option>Em desenvolvimento</option>
                                                <option>Precisa de atenção</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. PSICOPEDAGÓGICO (GRID 2 COLUNAS) */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-pink-600 text-sm uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                                    <Brain size={18} /> Desenvolvimento Cognitivo e Social
                                </h4>
                                <div className="grid md:grid-cols-2 gap-5">
                                    {['atencao_memoria', 'interacao_social', 'habilidades_cognitivas', 'coordenacao_motora', 'raciocinio_logico', 'regulacao_emocional'].map((campo) => (
                                        <div key={campo}>
                                            <label className="block text-xs font-bold text-slate-400 mb-1.5 capitalize ml-1">{campo.replace(/_/g, ' ')}</label>
                                            <textarea
                                                rows="3"
                                                className="w-full bg-pink-50/20 border border-slate-200 rounded-lg p-3 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-200 outline-none resize-none transition"
                                                placeholder="Descreva o desenvolvimento..."
                                                value={form.psico[campo]}
                                                onChange={e => setForm({ ...form, psico: { ...form.psico, [campo]: e.target.value } })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. OBSERVAÇÕES E FOTOS */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-600 text-sm uppercase mb-3 flex gap-2"><MessageSquare size={16} /> Observações Gerais</h4>
                                    <textarea
                                        rows="4"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none resize-none"
                                        placeholder="Recados importantes para os pais..."
                                        value={form.observacao}
                                        onChange={e => setForm({ ...form, observacao: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-1 bg-indigo-50 p-5 rounded-xl border border-indigo-100 border-dashed flex flex-col justify-center text-center">
                                    <div className="mb-4">
                                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-indigo-500">
                                            <ImageIcon size={24} />
                                        </div>
                                        <label className="block text-sm font-bold text-indigo-800">Anexar Fotos</label>
                                        <p className="text-xs text-indigo-400 mt-1">Atividades e eventos</p>
                                    </div>

                                    <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg">
                                        Selecionar
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                                    </label>

                                    {/* Lista de Fotos (Misto de Novas e Antigas) */}
                                    <div className="mt-4 grid grid-cols-4 gap-2 max-h-[100px] overflow-y-auto custom-scrollbar pr-1">
                                        {form.fotos.map((url, idx) => (
                                            <div key={`old-${idx}`} className="relative aspect-square group">
                                                <img src={url} className="w-full h-full object-cover rounded border border-indigo-200" alt="Antiga" />
                                                <button onClick={() => removeExistingPhoto(url)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded"><Trash2 size={12} /></button>
                                            </div>
                                        ))}
                                        {previewUrls.map((url, idx) => (
                                            <div key={`new-${idx}`} className="relative aspect-square group">
                                                <img src={url} className="w-full h-full object-cover rounded border-2 border-green-400" alt="Nova" />
                                                <button onClick={() => removeNewFile(idx)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded"><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Fixo */}
                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <Button
                                onClick={handleSalvar}
                                disabled={sending || uploading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-lg shadow-indigo-200 border-none h-10"
                            >
                                {sending || uploading ? "Salvando..." : (editingId ? "Salvar Alterações" : "Publicar Relatório")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}