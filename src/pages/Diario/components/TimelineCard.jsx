import { Calendar, User, BookOpen, Brain, MessageSquare, ImageIcon, CheckCircle, Star, Pencil } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "../../../components/Button";

export function TimelineCard({ item, canManage, isResponsavel, onEdit, onCiente }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${item.lido_pelos_pais ? 'border-slate-200' : 'border-indigo-200 ring-2 ring-indigo-50'}`}>

            {/* Header do Card */}
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
                        {item.bimestre}
                    </div>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Calendar size={14} /> {dayjs(item.created_at).format("DD/MM/YYYY")}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <User size={14} /> {item.autor?.nome}
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
                        <div className="flex items-center gap-1 pl-3 border-l border-slate-200">
                            <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition">
                                <Pencil size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
                {/* Seção Pedagógica */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <BookOpen size={14} /> Desempenho Pedagógico
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(item.avaliacao_pedagogica || {}).map(([key, value]) => (
                            <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                <span className="block text-xs text-slate-400 uppercase font-bold mb-1">{key}</span>
                                <span className={`text-sm font-semibold ${value === 'Precisa de atenção' ? 'text-red-500' : 'text-slate-700'}`}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seção Psicopedagógica */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <Brain size={14} /> Parecer Psicopedagógico
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(item.avaliacao_psico || {}).map(([key, value]) => value && (
                            <div key={key} className="bg-pink-50/30 p-3 rounded-lg border border-pink-100">
                                <span className="block text-xs text-pink-400 uppercase font-bold mb-1">{key.replace(/_/g, ' ')}</span>
                                <p className="text-sm text-slate-600 leading-relaxed">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Obs e Fotos */}
                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                    <div className={item.fotos?.length > 0 ? 'md:col-span-2' : 'md:col-span-3'}>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                            <MessageSquare size={14} /> Observações
                        </h4>
                        <div className="text-sm text-slate-600 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                            {item.observacao || "Sem observações adicionais."}
                        </div>
                    </div>

                    {item.fotos?.length > 0 && (
                        <div className="md:col-span-1">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                                <ImageIcon size={14} /> Galeria ({item.fotos.length})
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                {item.fotos.map((foto, idx) => (
                                    <a key={idx} href={foto} target="_blank" rel="noreferrer" className="aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden hover:opacity-80 transition block">
                                        <img src={foto} className="w-full h-full object-cover" alt="Atividade" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Botão Ciente */}
            {!item.lido_pelos_pais && isResponsavel && (
                <div className="bg-indigo-50 px-6 py-3 border-t border-indigo-100 text-center">
                    <Button onClick={onCiente} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto">
                        <CheckCircle size={16} className="mr-2" /> Confirmar Leitura
                    </Button>
                </div>
            )}
        </div>
    );
}