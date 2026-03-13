import { Pencil, Trash } from "lucide-react";
import { formatarParaBRL } from "../../../utils/format";

export function AlunoRow({ student, navigate, onDelete }) {
    return (
        <li
            onClick={() => navigate(`/alunos/${student.id}`)}
            className="grid grid-cols-7 gap-4 p-3 text-sm items-center cursor-pointer hover:bg-slate-50 transition"
        >
            <span className="col-span-3 font-medium flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                    {student.foto_url ? (
                        <img src={student.foto_url} className="w-full h-full object-cover" alt="" />
                    ) : student.nome.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{student.nome}</span>
                    <span className={`text-[10px] w-fit px-2 rounded-full ${student.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {student.status}
                    </span>
                </div>
            </span>
            <span className="col-span-2 text-slate-500">{student.responsavel}</span>
            <span className="col-span-1 font-medium">{formatarParaBRL(student.valor_mensalidade)}</span>
            <div className="col-span-1 flex justify-center gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/alunos/editar/${student.id}`); }}
                    className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(student.id); }}
                    className="p-1.5 rounded hover:bg-red-50 text-red-500 transition"
                >
                    <Trash className="w-4 h-4" />
                </button>
            </div>
        </li>
    );
}