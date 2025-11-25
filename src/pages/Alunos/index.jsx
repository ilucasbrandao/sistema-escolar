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
    const [onlyActive, setOnlyActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true); // <--- Feedback visual
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
    }, [searchTerm, onlyActive]);

    const filteredStudents = useMemo(() => {
        const filtered = students.filter((student) => {
            const matchesSearch =
                student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.responsavel.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesActive = onlyActive ? student.status === "ativo" : true;
            return matchesSearch && matchesActive;
        });
        return filtered.sort((a, b) => a.nome.localeCompare(b.nome));
    }, [students, searchTerm, onlyActive]);

    const paginatedStudents = paginate(
        filteredStudents,
        currentPage,
        itemsPerPage
    );
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    //! FUNÇÃO DE DELETAR ALUNO !//
    async function handleDelete(id) {
        // Substituir o prompt nativo por um Modal no futuro é o ideal.
        // O prompt bloqueia a thread do navegador.
        const confirmar = window.confirm(
            "Tem certeza que deseja remover este registro?"
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
                <div className="flex flex-col md:flex-row justify-end gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
                    />
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={onlyActive}
                            onChange={(e) => setOnlyActive(e.target.checked)}
                            className="w-4 h-4 accent-blue-600"
                        />
                        Apenas ativos
                    </label>
                </div>

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
                                    <li key={student.id} className="grid grid-cols-7 gap-4 p-3 text-sm hover:bg-slate-50 items-center">
                                        <span className="col-span-3 font-medium flex flex-col">
                                            {student.nome}
                                            <span className={`text-[10px] w-fit px-2 rounded-full ${student.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                {student.status}
                                            </span>
                                        </span>
                                        <span className="col-span-2 text-slate-500">{student.responsavel}</span>
                                        <span className="col-span-1">{formatarParaBRL(student.valor_mensalidade)}</span>

                                        <div className="col-span-1 flex justify-center gap-2">
                                            <ActionBtn
                                                icon={Pencil}
                                                color="text-blue-600"
                                                onClick={() => navigate(`/alunos/editar/${student.id}`)}
                                            />
                                            <ActionBtn
                                                icon={Trash}
                                                color="text-red-500"
                                                onClick={() => handleDelete(student.id)}
                                            />
                                            <ActionBtn
                                                icon={Eye}
                                                color="text-slate-600"
                                                onClick={() => navigate(`/alunos/${student.id}`)}
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
