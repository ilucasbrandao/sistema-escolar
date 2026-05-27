import { X, Calendar, MessageSquare, Image as ImageIcon, Trash2, FileText } from "lucide-react";
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
                        <p className="text-indigo-200 text-xs">Descreva a evolução e o desempenho do aluno no período.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><X size={20} /></button>
                </div>

                {/* Corpo Modal */}
                <div className="overflow-y-auto p-6 space-y-6 bg-slate-50/50">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* 1. Referência Temporal */}
                        <div className="md:col-span-1">
                            <FormCard title="Período" icon={Calendar}>
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
                        </div>

                        {/* 2. O NOVO CAMPO ÚNICO DE AVALIAÇÃO */}
                        <div className="md:col-span-3">
                            <FormCard
                                title="Parecer Descritivo do Atendimento"
                                icon={FileText}
                                iconColor="bg-indigo-50 text-indigo-600"
                            >
                                <Field label="Evolução Pedagógica, Cognitiva e Comportamental">
                                    <textarea
                                        rows="12"
                                        className={`${inputBaseClass} resize-none leading-relaxed`}
                                        placeholder="Utilize este espaço para descrever detalhadamente o desempenho do aluno, avanços pedagógicos, foco, interação social e comportamento durante os atendimentos..."
                                        value={form.parecer_atendimento}
                                        onChange={e => setForm({ ...form, parecer_atendimento: e.target.value })}
                                    />
                                </Field>
                            </FormCard>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* 3. Observações Rápidas (Recado para os pais) */}
                        <div className="md:col-span-2">
                            <FormCard title="Observações Gerais / Recados" icon={MessageSquare}>
                                <textarea
                                    rows="3"
                                    className={inputBaseClass}
                                    placeholder="Alguma recomendação específica ou recado rápido para a família?"
                                    value={form.observacao}
                                    onChange={e => setForm({ ...form, observacao: e.target.value })}
                                />
                            </FormCard>
                        </div>

                        {/* 4. Fotos da Atividade */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center h-full">
                                <ImageIcon className="mx-auto text-indigo-400 mb-2" size={32} />
                                <label className="block text-sm font-bold text-slate-700 mb-2">Registro Visual</label>
                                <input type="file" multiple accept="image/*" className="hidden" id="upload-foto" onChange={handleFileSelect} />
                                <label htmlFor="upload-foto" className="cursor-pointer bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm block hover:bg-indigo-200 transition font-bold">
                                    Adicionar Fotos
                                </label>

                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {/* Fotos já existentes no banco */}
                                    {form.fotos && form.fotos.map((url, i) => (
                                        <div key={i} className="relative group aspect-square">
                                            <img src={url} className="w-full h-full object-cover rounded border" alt="Atividade" />
                                            <button onClick={() => removeFile(i, true)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition rounded flex items-center justify-center">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* Previews de novas fotos selecionadas */}
                                    {previewUrls.map((url, i) => (
                                        <div key={i} className="relative group aspect-square">
                                            <img src={url} className="w-full h-full object-cover rounded border-2 border-green-400" alt="Preview" />
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
                    <Button variant="ghost" onClick={onClose} disabled={sending}>Cancelar</Button>
                    <Button onClick={onSave} disabled={sending} className="bg-indigo-600 text-white px-8 min-w-[150px]">
                        {sending ? "Salvando..." : (editingId ? "Atualizar Relatório" : "Publicar no Diário")}
                    </Button>
                </div>
            </div>
        </div>
    );
}