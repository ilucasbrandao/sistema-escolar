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
    FileText,
    UploadCloud,
    Trash2,
    Pencil // Ícone de Edição
} from "lucide-react";

export default function Diario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sending, setSending] = useState(false);

    // Controle de Edição
    const [editingId, setEditingId] = useState(null); // Null = Criando Novo, ID = Editando

    // Controle de Upload
    const [arquivosSelecionados, setArquivosSelecionados] = useState([]); // Novos arquivos (File objects)
    const [previewUrls, setPreviewUrls] = useState([]); // Previews dos novos arquivos
    const [uploading, setUploading] = useState(false);

    // Formulário
    const initialFormState = {
        bimestre: "1º Bimestre",
        pedagogico: {
            leitura: "Em desenvolvimento",
            escrita: "Em desenvolvimento",
            foco: "Bom",
            participacao: "Participativo"
        },
        psico: {
            atencao_memoria: "",
            interacao_social: "",
            regulacao_emocional: "",
            parecer_geral: ""
        },
        fotos: [], // URLs já salvas no banco
        observacao: ""
    };

    const [form, setForm] = useState(initialFormState);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const canManage = user.role === "admin" || user.role === "professor"; // Pode criar/editar/excluir
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

    async function uploadImages() {
        if (arquivosSelecionados.length === 0) return [];

        const formData = new FormData();
        arquivosSelecionados.forEach(file => {
            formData.append("files", file);
        });

        try {
            setUploading(true);
            const res = await api.post("/upload", formData);
            return res.data.urls;
        } catch (error) {
            toast.error("Erro ao fazer upload das imagens.");
            return [];
        } finally {
            setUploading(false);
        }
    }

    // --- AÇÕES DO CRUD ---

    // 1. Abrir Modal para CRIAR
    function handleOpenNew() {
        setForm(initialFormState);
        setArquivosSelecionados([]);
        setPreviewUrls([]);
        setEditingId(null);
        setIsModalOpen(true);
    }

    // 2. Abrir Modal para EDITAR
    function handleOpenEdit(item) {
        setForm({
            bimestre: item.bimestre,
            pedagogico: item.avaliacao_pedagogica || initialFormState.pedagogico,
            psico: item.avaliacao_psico || initialFormState.psico,
            fotos: item.fotos || [], // Carrega as fotos existentes
            observacao: item.observacao || ""
        });
        setArquivosSelecionados([]);
        setPreviewUrls([]);
        setEditingId(item.id); // Define o ID que estamos editando
        setIsModalOpen(true);
    }

    // 3. EXCLUIR
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

    // 4. SALVAR (Criar ou Atualizar)
    async function handleSalvar(e) {
        e.preventDefault();
        setSending(true);

        try {
            // A. Upload das NOVAS imagens
            let urlsNovas = [];
            if (arquivosSelecionados.length > 0) {
                urlsNovas = await uploadImages();
                if (urlsNovas.length === 0 && arquivosSelecionados.length > 0) {
                    setSending(false);
                    return;
                }
            }

            // B. Combina fotos antigas (que não foram deletadas) com as novas
            const fotosFinais = [...form.fotos, ...urlsNovas];

            const payload = {
                aluno_id: id,
                bimestre: form.bimestre,
                avaliacao_pedagogica: form.pedagogico,
                avaliacao_psico: form.psico,
                fotos: fotosFinais,
                observacao: form.observacao
            };

            if (editingId) {
                // EDITAR (PUT)
                await api.put(`/feedbacks/${editingId}`, payload);
                toast.success("Relatório atualizado!");
            } else {
                // CRIAR (POST)
                await api.post("/feedbacks", payload);
                toast.success("Relatório criado!");
            }

            setIsModalOpen(false);
            loadData();

        } catch (error) {
            toast.error("Erro ao salvar relatório.");
            console.error(error);
        } finally {
            setSending(false);
        }
    }

    async function handleCiente(feedbackId) {
        try {
            await api.put(`/feedbacks/ler/${feedbackId}`);
            setFeedbacks(prev => prev.map(item => item.id === feedbackId ? { ...item, lido_pelos_pais: true } : item));
            toast.success("Confirmado!");
        } catch (error) { toast.error("Erro."); }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-indigo-600 mb-2 gap-1 font-medium">
                        <ArrowLeft size={18} /> Voltar
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">Relatórios de Desenvolvimento</h1>
                </div>
                {canManage && (
                    <Button onClick={handleOpenNew} className="bg-indigo-600 hover:bg-indigo-700 text-white flex gap-2 shadow-sm">
                        <Plus size={20} /> Novo Relatório
                    </Button>
                )}
            </div>

            {/* Lista de Relatórios */}
            <main className="max-w-4xl mx-auto space-y-8">
                {loading ? <p className="text-center text-slate-400">Carregando...</p> :
                    feedbacks.length === 0 ? (
                        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
                            <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <p className="text-slate-500">Nenhum relatório bimestral lançado ainda.</p>
                        </div>
                    ) : (
                        feedbacks.map((item) => (
                            <div key={item.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${item.lido_pelos_pais ? 'border-slate-200' : 'border-indigo-200 ring-1 ring-indigo-50'}`}>

                                {/* Cabeçalho do Card */}
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg border border-slate-200 text-indigo-600 font-bold shadow-sm">
                                            {item.bimestre || "Relatório Geral"}
                                        </div>
                                        <span className="text-sm text-slate-400 flex items-center gap-1">
                                            <Calendar size={14} /> {dayjs(item.data_aula).format("DD/MM/YYYY")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {item.lido_pelos_pais && (
                                            <span className="text-xs font-bold text-green-600 flex items-center gap-1 mr-2">
                                                <CheckCircle size={12} /> Visto
                                            </span>
                                        )}

                                        {/* --- BOTÕES DE ADMINISTRAÇÃO (EDITAR / EXCLUIR) --- */}
                                        {canManage && (
                                            <div className="flex items-center gap-1 border-l pl-3 border-slate-300 ml-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleExcluir(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 grid md:grid-cols-2 gap-8">
                                    {/* Conteúdo Pedagógico/Psico (Igual ao anterior) */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
                                            <BookOpen size={16} /> Desempenho Escolar
                                        </h3>
                                        {item.avaliacao_pedagogica && (
                                            <div className="grid grid-cols-1 gap-2 text-sm">
                                                {Object.entries(item.avaliacao_pedagogica).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between bg-slate-50 p-2 rounded border border-slate-100">
                                                        <span className="capitalize text-slate-600 font-medium">{key}:</span>
                                                        <span className="font-bold text-slate-800">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {item.observacao && (
                                            <div className="text-sm text-slate-600 mt-2 bg-yellow-50 p-3 rounded border border-yellow-100">
                                                <span className="font-bold text-yellow-700 block text-xs uppercase mb-1">Observações Gerais:</span>
                                                {item.observacao}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-pink-600 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
                                            <Brain size={16} /> Avaliação Psicopedagógica
                                        </h3>
                                        {item.avaliacao_psico && Object.keys(item.avaliacao_psico).length > 0 ? (
                                            <div className="space-y-3 text-sm">
                                                {Object.entries(item.avaliacao_psico).map(([key, value]) => value && (
                                                    <div key={key}>
                                                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{key.replace("_", " ")}</span>
                                                        <p className="text-slate-700 bg-pink-50/50 p-2 rounded border border-pink-100 leading-relaxed">
                                                            {value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">Nenhum parecer registrado.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Fotos */}
                                <div className="px-6 pb-6 pt-0">
                                    {item.fotos && item.fotos.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><ImageIcon size={14} /> Registros de Atividades</h4>
                                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                                {item.fotos.map((foto, idx) => (
                                                    <a key={idx} href={foto} target="_blank" rel="noreferrer" className="block w-24 h-24 bg-slate-100 rounded-lg border overflow-hidden hover:opacity-80 transition shrink-0 relative group">
                                                        <img
                                                            src={foto}
                                                            alt="Atividade"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100?text=Erro"; }}
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 flex justify-between items-end border-t pt-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                                            <div className="bg-slate-200 p-1.5 rounded-full"><User size={12} /></div>
                                            <div>
                                                <p className="uppercase font-bold text-[10px] tracking-wider">Lançado por</p>
                                                <p className="font-medium text-slate-700">Prof. {item.autor_nome}</p>
                                            </div>
                                        </div>
                                        {!item.lido_pelos_pais && isResponsavel && (
                                            <Button onClick={() => handleCiente(item.id)} className="bg-indigo-600 h-9 text-xs">Marcar como Lido</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
            </main>

            {/* --- MODAL (CRIAR / EDITAR) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
                            <h3 className="font-bold flex items-center gap-2">
                                {editingId ? <Pencil size={18} /> : <Plus size={18} />}
                                {editingId ? "Editar Relatório" : "Novo Relatório"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>

                        <div className="overflow-y-auto p-6 space-y-6">
                            {/* Seletor de Bimestre */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Referência</label>
                                <select className="w-full border rounded p-2" value={form.bimestre} onChange={e => setForm({ ...form, bimestre: e.target.value })}>
                                    <option>1º Bimestre</option>
                                    <option>2º Bimestre</option>
                                    <option>3º Bimestre</option>
                                    <option>4º Bimestre</option>
                                </select>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Pedagógico */}
                                <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <h4 className="font-bold text-indigo-700 text-sm flex gap-2"><BookOpen size={16} /> Pedagógico</h4>
                                    {Object.keys(form.pedagogico).map((campo) => (
                                        <div key={campo}>
                                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{campo}</label>
                                            <select
                                                className="w-full border rounded p-1.5 text-sm"
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

                                {/* Psico */}
                                <div className="space-y-3 p-4 bg-pink-50 rounded-lg border border-pink-100">
                                    <h4 className="font-bold text-pink-700 text-sm flex gap-2"><Brain size={16} /> Psicopedagógico</h4>
                                    <div>
                                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Atenção e Memória</label>
                                        <textarea rows="2" className="w-full border rounded p-2 text-sm"
                                            value={form.psico.atencao_memoria} onChange={e => setForm({ ...form, psico: { ...form.psico, atencao_memoria: e.target.value } })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Interação Social</label>
                                        <textarea rows="2" className="w-full border rounded p-2 text-sm"
                                            value={form.psico.interacao_social} onChange={e => setForm({ ...form, psico: { ...form.psico, interacao_social: e.target.value } })} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Observações Gerais</label>
                                <textarea rows="2" className="w-full border rounded p-2" placeholder="Observações..."
                                    value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
                            </div>

                            {/* --- AREA DE FOTOS (ATUALIZADA) --- */}
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 border-dashed">
                                <label className="block text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                                    <ImageIcon size={18} /> Fotos da Atividade
                                </label>

                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition">
                                        <UploadCloud size={16} /> Adicionar Fotos
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                                    </label>
                                </div>

                                {/* FOTOS JÁ EXISTENTES (Vindas do Banco) */}
                                {form.fotos.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-bold text-indigo-400 mb-2 uppercase">Fotos Salvas:</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {form.fotos.map((url, idx) => (
                                                <div key={idx} className="relative w-20 h-20 shrink-0 group">
                                                    <img src={url} className="w-full h-full object-cover rounded-lg border border-indigo-200" alt="Existente" />
                                                    <button
                                                        onClick={() => removeExistingPhoto(url)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-10"
                                                        title="Remover foto"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* NOVAS FOTOS (Preview) */}
                                {previewUrls.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-bold text-green-600 mb-2 uppercase">Novas fotos para enviar:</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {previewUrls.map((url, idx) => (
                                                <div key={idx} className="relative w-20 h-20 shrink-0 group">
                                                    <img src={url} className="w-full h-full object-cover rounded-lg border-2 border-green-400" alt="Novo Preview" />
                                                    <button
                                                        onClick={() => removeNewFile(idx)}
                                                        className="absolute -top-2 -right-2 bg-slate-500 text-white rounded-full p-1 shadow-md hover:bg-slate-600 z-10"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t bg-slate-50 flex justify-end gap-2 shrink-0">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSalvar} disabled={sending || uploading} className="bg-indigo-600 text-white min-w-[140px]">
                                {sending || uploading ? "Salvando..." : (editingId ? "Atualizar" : "Salvar Relatório")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}