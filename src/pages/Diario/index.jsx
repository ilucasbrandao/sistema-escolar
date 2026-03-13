import { useParams, useNavigate } from "react-router-dom";
import { useDiario } from "../../hooks/useDiario";
import { Button } from "../../components/Button";
import { TimelineCard } from "./components/TimelineCard";
import { ModalFeedback } from "./components/ModalFeedback";
import { ArrowLeft, Plus, FileText } from "lucide-react";

export default function Diario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const canManage = ["admin", "professor"].includes(user.role);

    const {
        feedbacks, loading, isModalOpen, setIsModalOpen, sending,
        form, setForm, handleFileSelect, removeFile, handleSave,
        previewUrls, editingId, setEditingId, initialFormState, handleCiente
    } = useDiario(id);

    const handleOpenEdit = (item) => {
        // Removemos o campo 'parecer_geral' via desestruturação
        const { parecer_geral, ...psicoFiltrado } = item.avaliacao_psico || {};

        setForm({
            bimestre: item.bimestre,
            pedagogico: item.avaliacao_pedagogica,
            psico: psicoFiltrado, // Agora o objeto só tem as chaves que você quer
            fotos: item.fotos || [],
            observacao: item.observacao || ""
        });
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <header className="max-w-5xl mx-auto mb-8 flex justify-between items-end">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-indigo-600 mb-2 gap-1 font-medium transition-colors">
                        <ArrowLeft size={18} /> Voltar
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">Diário Escolar</h1>
                </div>
                {canManage && (
                    <Button onClick={() => { setForm(initialFormState); setEditingId(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white">
                        <Plus size={20} /> Novo Relatório
                    </Button>
                )}
            </header>

            <main className="max-w-5xl mx-auto space-y-8 pb-20">
                {loading ? (
                    <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600"></div></div>
                ) : feedbacks.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300">
                        <FileText className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Nenhum relatório encontrado</h3>
                    </div>
                ) : (
                    feedbacks.map(item => (
                        <TimelineCard
                            key={item.id}
                            item={item}
                            canManage={canManage}
                            isResponsavel={user.role === "responsavel"}
                            onEdit={() => handleOpenEdit(item)}
                            onCiente={() => handleCiente(item.id)}
                        />
                    ))
                )}
            </main>

            {isModalOpen && (
                <ModalFeedback
                    editingId={editingId}
                    form={form}
                    setForm={setForm}
                    previewUrls={previewUrls}
                    handleFileSelect={handleFileSelect}
                    removeFile={removeFile}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                    sending={sending}
                />
            )}
        </div>
    );
}