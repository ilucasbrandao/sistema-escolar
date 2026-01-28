import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeftIcon,
    Eye,
    Pencil,
    Trash,
    UserRoundPlus,
} from "lucide-react";

import { Button } from "../../components/Button";
import { Container, Paragraph, Title } from "../../components/Container";
import api from "../../services/api";
import { formatarParaBRL } from "../../utils/format";
import { paginate } from "../../utils/paginate";

export function Alunos() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showInactive, setShowInactive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [turnoFilter, setTurnoFilter] = useState("todos");
    const itemsPerPage = 10;

    // Busca inicial
    useEffect(() => {
        // Função definida dentro para evitar vazamento de memória se o componente desmontar
        let isMounted = true;

        async function getStudents() {
            try {
                setIsLoading(true);
                const { data } = await api.get("/alunos");
                if (isMounted) setStudents(data);
            } catch (error) {
                console.error("Erro ao buscar alunos:", error.message);
                alert("Não foi possível carregar a lista de alunos.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        getStudents();

        return () => {
            isMounted = false;
        };
    }, []);

    // Resetar página quando filtrar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showInactive, turnoFilter]);

    const filteredStudents = useMemo(() => {
        return students
            .filter((student) => {
                const matchesSearch =
                    student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.responsavel.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus = showInactive
                    ? student.status === "inativo"
                    : student.status === "ativo";

                const matchesTurno =
                    turnoFilter === "todos" ? true : student.turno === turnoFilter;

                return matchesSearch && matchesStatus && matchesTurno;
            })
            .sort((a, b) => a.nome.localeCompare(b.nome));
    }, [students, searchTerm, showInactive, turnoFilter]);

    // Contagem de alunos por turno
    const studentsByTurno = useMemo(() => {
        const counters = {
            Manhã: 0,
            Tarde: 0,
            Noite: 0,
        };

        students.forEach((student) => {
            if (student.status === "ativo" && student.turno) {
                counters[student.turno] = (counters[student.turno] || 0) + 1;
            }
        });

        return counters;
    }, [students]);

    const paginatedStudents = paginate(
        filteredStudents,
        currentPage,
        itemsPerPage,
    );
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    //! FUNÇÃO DE DELETAR ALUNO !//
    async function handleDelete(id) {
        // Substituir o prompt nativo por um Modal no futuro é o ideal.
        // O prompt bloqueia a thread do navegador.
        const confirmar = window.confirm(
            "Tem certeza que deseja remover este registro?",
        );

        if (!confirmar) return;

        try {
            await api.delete(`/alunos/${id}`);
            // Atualização Otimista: Remove da tela antes mesmo de re-buscar
            setStudents((prev) => prev.filter((student) => student.id !== id));
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir. Verifique se o aluno possui pendências.");
        }
    }

    return (
        <Container>
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </Button>
                <Title level={1}>Alunos</Title>
                <Button onClick={() => navigate("/alunos/cadastrar")}>
                    <UserRoundPlus className="w-5 h-5" />
                </Button>
            </div>

            <div className="mb-8">
                {/* Filtros */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    {/* Busca */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Buscar aluno ou responsável..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            🔍
                        </span>
                    </div>

                    {/* Filtros à direita */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        {/* Turno */}
                        <select
                            value={turnoFilter}
                            onChange={(e) => setTurnoFilter(e.target.value)}
                            className="px-3 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="todos">Todos os turnos</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                        </select>

                        {/* Status */}
                        <button
                            type="button"
                            onClick={() => setShowInactive((prev) => !prev)}
                            className={`px-4 py-2.5 text-sm rounded-md border transition
                    ${showInactive
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                }`}
                        >
                            {showInactive ? "Mostrando inativos" : "Mostrar inativos"}
                        </button>
                    </div>
                </div>
            </div>
            <div>
                {isLoading ? (
                    <div className="text-center py-10 text-slate-500">
                        Carregando alunos...
                    </div>
                ) : (
                    <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                        <ul className="min-w-[700px] divide-y divide-gray-200 bg-white">
                            <li className="grid grid-cols-7 gap-4 p-3 bg-slate-100 font-bold text-xs text-slate-600 uppercase">
                                <span className="col-span-3">Nome</span>
                                <span className="col-span-2">Responsável</span>
                                <span className="col-span-1">Valor</span>
                                <span className="col-span-1 text-center">Ações</span>
                            </li>

                            {paginatedStudents.length === 0 ? (
                                <li className="p-4 text-center text-slate-500">
                                    Nenhum aluno encontrado.
                                </li>
                            ) : (
                                paginatedStudents.map((student) => (
                                    <li
                                        key={student.id}
                                        onClick={() => navigate(`/alunos/${student.id}`)}
                                        className="grid grid-cols-7 gap-4 p-3 text-sm items-center cursor-pointer hover:bg-slate-50 transition"
                                    >
                                        <span className="col-span-3 font-medium flex items-center gap-3">
                                            {/* Miniatura da Foto */}
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                                {student.foto_url ? (
                                                    <img
                                                        src={student.foto_url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                                        {student.nome.charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            <span className="col-span-3 font-medium flex flex-col">
                                                {student.nome}
                                                <span
                                                    className={`text-[10px] w-fit px-2 rounded-full ${student.status === "ativo"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {student.status}
                                                </span>
                                            </span>
                                        </span>
                                        <span className="col-span-2 text-slate-500">
                                            {student.responsavel}
                                        </span>
                                        <span className="col-span-1">
                                            {formatarParaBRL(student.valor_mensalidade)}
                                        </span>

                                        <div className="col-span-1 flex justify-center gap-2">
                                            <ActionBtn
                                                icon={Pencil}
                                                color="text-blue-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/alunos/editar/${student.id}`);
                                                }}
                                            />
                                            <ActionBtn
                                                icon={Trash}
                                                color="text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(student.id);
                                                }}
                                            />
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}

                {/* Paginação (Simplifiquei visualmente) */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            Anterior
                        </Button>
                        <span className="self-center text-sm">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            Próxima
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
}

// Mini componente para limpar o código repetitivo dos botões
const ActionBtn = ({ icon: Icon, color, onClick }) => (
    <button
        onClick={onClick}
        className={`p-1.5 rounded hover:bg-gray-100 transition ${color}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);
