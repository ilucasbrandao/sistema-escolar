import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import {
    Search,
    Crown,
    ChevronRight,
    ChevronLeft,
    GraduationCap
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
                const ativos = data.filter(a => a.status === "ativo");

                // Ordena: Premium primeiro, depois A-Z
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

    // Lógica de Busca
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
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <main className="max-w-5xl mx-auto space-y-6">

                {/* Cabeçalho Padrão */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <GraduationCap className="text-indigo-600" /> Diário de Classe
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Lançamento de relatórios bimestrais e avaliações.
                        </p>
                    </div>
                </div>

                {/* Barra de Busca Padrão */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar aluno por nome..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition text-slate-700"
                            value={busca}
                            onChange={(e) => {
                                setBusca(e.target.value);
                                setPaginaAtual(1); // Reseta para pág 1 ao buscar
                            }}
                        />
                    </div>
                </div>

                {/* Tabela de Alunos */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="p-5 border-b pl-8">Nome do Aluno</th>
                                    <th className="p-5 border-b">Plano</th>
                                    <th className="p-5 border-b">Série/Turma</th>
                                    <th className="p-5 border-b text-right pr-8">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-slate-400">Carregando lista...</td></tr>
                                ) : alunosAtuais.length === 0 ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-slate-400">Nenhum aluno encontrado.</td></tr>
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
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isPremium ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                                                            {aluno.nome.charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{aluno.nome}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {isPremium ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <Crown size={12} className="fill-current" /> Premium
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Padrão</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">
                                                    {aluno.serie || "-"}
                                                </td>
                                                <td className="p-4 pr-8 text-right">
                                                    <Button variant="ghost" className="text-indigo-600 hover:bg-indigo-50 text-sm">
                                                        Abrir <ChevronRight size={16} />
                                                    </Button>
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
                            <span className="text-xs text-slate-400">
                                Mostrando {indexPrimeiro + 1} a {Math.min(indexUltimo, alunosFiltrados.length)} de {alunosFiltrados.length} alunos
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => mudarPagina(paginaAtual - 1)}
                                    disabled={paginaAtual === 1}
                                    className="p-2 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 border border-transparent hover:border-slate-200 transition"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPaginas }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => mudarPagina(i + 1)}
                                        className={`w-8 h-8 rounded text-xs font-bold transition ${paginaAtual === i + 1 ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => mudarPagina(paginaAtual + 1)}
                                    disabled={paginaAtual === totalPaginas}
                                    className="p-2 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 border border-transparent hover:border-slate-200 transition"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}