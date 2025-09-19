import dayjs from "dayjs";
import { Pencil, Trash } from "lucide-react";

export function LancamentosTable({ lancamentos, onPagar, onEditar, onExcluir }) {
    return (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm mt-6">
            {/* Cabeçalho */}
            <li className="grid grid-cols-11 gap-4 p-3 bg-slate-100 font-medium text-slate-600 text-xs uppercase tracking-wide">
                <span>ID</span>
                <span>Tipo</span>
                <span>Categoria</span>
                <span>Descrição</span>
                <span>Valor</span>
                <span>Data Venc.</span>
                <span>Aluno</span>
                <span>Professor</span>
                <span>Status</span>
                <span className="text-center">Editar</span>
                <span className="text-center">Excluir / Pagar</span>
            </li>

            {/* Linhas */}
            {lancamentos.map(l => (
                <li
                    key={l.id}
                    className="grid grid-cols-11 gap-4 p-3 text-sm odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors items-center"
                >
                    <span className="text-slate-500">{l.id}</span>
                    <span className="capitalize font-medium text-slate-800">{l.tipo}</span>
                    <span className="text-slate-500">{l.categoria}</span>
                    <span className="text-slate-500">{l.descricao || "-"}</span>
                    <span className="text-slate-500">
                        {Number(l.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                    <span className="text-slate-500">
                        {l.data_vencimento ? dayjs(l.data_vencimento).format("DD/MM/YYYY") : "-"}
                    </span>
                    <span className="text-slate-500">{l.aluno_nome || "-"}</span>
                    <span className="text-slate-500">{l.professor_nome || "-"}</span>
                    <span className={`font-semibold ${l.status === "finalizado" ? "text-green-600" : "text-red-500"}`}>
                        {l.status}
                    </span>

                    {/* Editar */}
                    <span className="flex justify-center">
                        <button
                            onClick={() => onEditar(l.id)}
                            className="p-1.5 rounded-md hover:bg-slate-200 transition"
                        >
                            <Pencil className="w-4 h-4 text-slate-600" />
                        </button>
                    </span>

                    {/* Excluir ou Pagar */}
                    <span className="flex justify-center gap-1">
                        {l.status === "pendente" && (
                            <button
                                onClick={() => onPagar(l.id)}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-xs"
                            >
                                Pagar
                            </button>
                        )}
                        <button
                            onClick={() => onExcluir(l.id)}
                            className="p-1.5 rounded-md hover:bg-red-100 transition"
                        >
                            <Trash className="w-4 h-4 text-red-600" />
                        </button>
                    </span>
                </li>
            ))}
        </ul>
    );
}
