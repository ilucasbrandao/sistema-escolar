import { X, Calendar, BookOpen, Brain, MessageSquare, Image as ImageIcon, Trash2 } from "lucide-react";
import { FormCard } from "../../../components/FormCard";
import { Field } from "../../../components/Field";
import { Button } from "../../../components/Button";
import { inputBaseClass } from "../../../components/InputBaseClass";

export function ModalFeedback({
    editingId, form, setForm, previewUrls, handleFileSelect,
    removeFile, onSave, onClose, sending
}) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

                {/* Header Modal */}
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 className="font-bold text-lg">{editingId ? "Editar Relatório" : "Novo Relatório"}</h3>
                        <p className="text-indigo-200 text-xs">Preencha o acompanhamento do aluno.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><X size={20} /></button>
                </div>

                {/* Corpo Modal */}
                <div className="overflow-y-auto p-6 space-y-8 bg-slate-50/50">

                    <FormCard title="Referência" icon={Calendar}>
                        <Field label="Bimestre">
                            <select
                                className={inputBaseClass}
                                value={form.bimestre}
                                onChange={e => setForm({ ...form, bimestre: e.target.value })}
                            >
                                <option>1º Bimestre</option>
                                <option>2º Bimestre</option>
                                <option>3º Bimestre</option>
                                <option>4º Bimestre</option>
                            </select>
                        </Field>
                    </FormCard>

                    <FormCard title="Avaliação Pedagógica" icon={BookOpen} iconColor="bg-blue-50 text-blue-600">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {Object.keys(form.pedagogico).map((campo) => (
                                <Field key={campo} label={campo.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())} className="capitalize">
                                    <select
                                        className={inputBaseClass}
                                        value={form.pedagogico[campo]}
                                        onChange={e => setForm({ ...form, pedagogico: { ...form.pedagogico, [campo]: e.target.value } })}
                                    >
                                        <option>Excelente</option>
                                        <option>Bom</option>
                                        <option>Em desenvolvimento</option>
                                        <option>Precisa de atenção</option>
                                    </select>
                                </Field>
                            ))}
                        </div>
                    </FormCard>

                    <FormCard title="Desenvolvimento" icon={Brain} iconColor="bg-pink-50 text-pink-600">
                        <div className="grid md:grid-cols-2 gap-5">
                            {Object.keys(form.psico).map((campo) => (
                                <Field key={campo} label={campo.replace(/_/g, ' ')} className="capitalize">
                                    <textarea
                                        rows="2"
                                        className={inputBaseClass}
                                        placeholder="Observações..."
                                        value={form.psico[campo]}
                                        onChange={e => setForm({ ...form, psico: { ...form.psico, [campo]: e.target.value } })}
                                    />
                                </Field>
                            ))}
                        </div>
                    </FormCard>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <FormCard title="Observações Gerais" icon={MessageSquare}>
                                <textarea
                                    rows="4"
                                    className={inputBaseClass}
                                    placeholder="Recado para os pais..."
                                    value={form.observacao}
                                    onChange={e => setForm({ ...form, observacao: e.target.value })}
                                />
                            </FormCard>
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
                                <ImageIcon className="mx-auto text-indigo-400 mb-2" size={32} />
                                <label className="block text-sm font-bold text-slate-700 mb-2">Fotos da Atividade</label>
                                <input type="file" multiple accept="image/*" className="hidden" id="upload-foto" onChange={handleFileSelect} />
                                <label htmlFor="upload-foto" className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm block hover:bg-indigo-700 transition">
                                    Selecionar
                                </label>

                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {form.fotos.map((url, i) => (
                                        <div key={i} className="relative group aspect-square">
                                            <img src={url} className="w-full h-full object-cover rounded border" />
                                            <button onClick={() => removeFile(i, true)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition rounded flex items-center justify-center">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {previewUrls.map((url, i) => (
                                        <div key={i} className="relative group aspect-square">
                                            <img src={url} className="w-full h-full object-cover rounded border-2 border-green-400" />
                                            <button onClick={() => removeFile(i)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition rounded flex items-center justify-center">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button onClick={onSave} disabled={sending} className="bg-indigo-600 text-white px-8">
                        {sending ? "Salvando..." : (editingId ? "Atualizar" : "Publicar")}
                    </Button>
                </div>
            </div>
        </div>
    );
}