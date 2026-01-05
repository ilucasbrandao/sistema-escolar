import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import {
    Search,
    Crown,
    ChevronRight,
    ChevronLeft,
    GraduationCap,
    User
} from "lucide-react";

export default function ListaAlunosDiario() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    useEffect(() => {
        async function loadAlunos() {
            try {
                const { data } = await api.get("/alunos");
                // Garante que só traga ativos para o diário
                const ativos = data.filter(a => a.status === "ativo");

                // Ordenação: Premium primeiro, depois A-Z
                const ordenados = ativos.sort((a, b) => {
                    if (a.plano === 'premium' && b.plano !== 'premium') return -1;
                    if (a.plano !== 'premium' && b.plano === 'premium') return 1;
                    return a.nome.localeCompare(b.nome);
                });
                setAlunos(ordenados);
            } catch (error) {
                console.error("Erro ao listar alunos", error);
            } finally {
                setLoading(false);
            }
        }
        loadAlunos();
    }, []);

    // Lógica de Busca e Filtro
    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(busca.toLowerCase())
    );

    // Lógica de Paginação
    const indexUltimo = paginaAtual * itensPorPagina;
    const indexPrimeiro = indexUltimo - itensPorPagina;
    const alunosAtuais = alunosFiltrados.slice(indexPrimeiro, indexUltimo);
    const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);

    const mudarPagina = (numero) => setPaginaAtual(numero);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-600">
            <main className="max-w-5xl mx-auto space-y-8">

                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <GraduationCap className="text-indigo-600 w-8 h-8" />
                            Diário de Classe
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm max-w-md">
                            Selecione um aluno abaixo para lançar frequências, notas e ocorrências no diário escolar.
                        </p>
                    </div>
                </div>

                {/* Barra de Busca */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar aluno por nome..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                            value={busca}
                            onChange={(e) => {
                                setBusca(e.target.value);
                                setPaginaAtual(1);
                            }}
                        />
                    </div>
                </div>

                {/* Tabela de Alunos */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="p-5 pl-8">Aluno</th>
                                    <th className="p-5">Plano</th>
                                    <th className="p-5">Série/Turma</th>
                                    <th className="p-5 text-right pr-8">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center text-slate-400 animate-pulse">
                                            Carregando lista de alunos...
                                        </td>
                                    </tr>
                                ) : alunosAtuais.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <User className="w-10 h-10 text-slate-200" />
                                                <span className="text-slate-500">Nenhum aluno encontrado.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    alunosAtuais.map((aluno) => {
                                        const isPremium = aluno.plano === 'premium';
                                        return (
                                            <tr
                                                key={aluno.id}
                                                className="hover:bg-slate-50 transition cursor-pointer group"
                                                onClick={() => navigate(`/diario/${aluno.id}`)}
                                            >
                                                <td className="p-4 pl-8">
                                                    <div className="flex items-center gap-4">
                                                        {/* Avatar / Foto */}
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 overflow-hidden ${isPremium ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-500 border-white'
                                                            }`}>
                                                            {aluno.foto_url ? (
                                                                <img src={aluno.foto_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                aluno.nome.charAt(0)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-700 block">{aluno.nome}</span>
                                                            {/* Opcional: mostrar matrícula pequena */}
                                                            {/* <span className="text-xs text-slate-400">#{aluno.id}</span> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {isPremium ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                                                            <Crown size={10} className="fill-current" /> Premium
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wide">
                                                            Padrão
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm font-medium text-slate-600">
                                                    {aluno.serie || <span className="text-slate-300 italic">Sem enturmação</span>}
                                                </td>
                                                <td className="p-4 pr-8 text-right">
                                                    <div className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                                        Abrir Diário <ChevronRight size={16} />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Rodapé de Paginação */}
                    {totalPaginas > 1 && (
                        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
                            <span className="text-xs text-slate-400 font-medium ml-2">
                                Mostrando {indexPrimeiro + 1} a {Math.min(indexUltimo, alunosFiltrados.length)} de {alunosFiltrados.length} alunos
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => mudarPagina(paginaAtual - 1)}
                                    disabled={paginaAtual === 1}
                                    className="p-2 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 border border-transparent hover:border-slate-200 hover:shadow-sm transition"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {Array.from({ length: totalPaginas }, (_, i) => {
                                    const pageNum = i + 1;
                                    // Lógica simples para não mostrar muitos botões se tiver muitas páginas
                                    if (totalPaginas > 7 && Math.abs(pageNum - paginaAtual) > 2 && pageNum !== 1 && pageNum !== totalPaginas) {
                                        if (Math.abs(pageNum - paginaAtual) === 3) return <span key={i} className="text-slate-300 self-end px-1">...</span>;
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => mudarPagina(pageNum)}
                                            className={`w-9 h-9 rounded-lg text-xs font-bold transition flex items-center justify-center ${paginaAtual === pageNum
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => mudarPagina(paginaAtual + 1)}
                                    disabled={paginaAtual === totalPaginas}
                                    className="p-2 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 border border-transparent hover:border-slate-200 hover:shadow-sm transition"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}