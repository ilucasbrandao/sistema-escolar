import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeftIcon,
    Pencil,
    Trash,
    UserRoundPlus,
} from "lucide-react";

import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import api from "../../services/api";
import { formatarParaBRL } from "../../utils/format";
import { paginate } from "../../utils/paginate";

export function Professores() {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showInactive, setShowInactive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 10;

    // Busca inicial
    useEffect(() => {
        let isMounted = true;

        async function getTeachers() {
            try {
                setIsLoading(true);
                const { data } = await api.get("/professores");
                if (isMounted) setTeachers(data);
            } catch (error) {
                console.error("Erro ao buscar professores:", error.message);
                alert("Não foi possível carregar a lista de professores.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        getTeachers();

        return () => {
            isMounted = false;
        };
    }, []);

    // Resetar página quando filtrar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showInactive]);

    const filteredTeachers = useMemo(() => {
        return teachers
            .filter((teacher) => {
                const matchesSearch =
                    teacher.nome.toLowerCase().includes(searchTerm.toLowerCase());

                // Regra de Status
                const matchesStatus = showInactive
                    ? teacher.status === "inativo"
                    : teacher.status === "ativo";

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => a.nome.localeCompare(b.nome));
    }, [teachers, searchTerm, showInactive]);

    const paginatedTeachers = paginate(
        filteredTeachers,
        currentPage,
        itemsPerPage
    );
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

    // Função de Excluir (Mantendo a lógica de segurança que você tinha antes)
    async function handleDelete(id) {
        // Se quiser manter a senha de exclusão, descomente as linhas abaixo
        /*
        const senha = prompt("Digite a senha para excluir o professor(a):");
        const senhaCorreta = import.meta.env.VITE_SENHA_EXCLUSAO;
        if (senha !== senhaCorreta) {
            alert("Senha incorreta.");
            return;
        }
        */

        const confirmar = window.confirm(
            "Tem certeza que deseja remover este professor?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/professores/${id}`);
            // Atualização Otimista
            setTeachers((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir. Verifique vínculos.");
        }
    }

    return (
        <Container>
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </Button>
                <Title level={1}>Professores</Title>
                <Button onClick={() => navigate("/professores/cadastrar")}>
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
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="w-4 h-4 accent-blue-600"
                        />
                        Mostrar apenas inativos
                    </label>
                </div>

                {isLoading ? (
                    <div className="text-center py-10 text-slate-500">
                        Carregando professores...
                    </div>
                ) : (
                    <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                        <ul className="min-w-[700px] divide-y divide-gray-200 bg-white">
                            <li className="grid grid-cols-7 gap-4 p-3 bg-slate-100 font-bold text-xs text-slate-600 uppercase">
                                <span className="col-span-3">Nome</span>
                                <span className="col-span-2">Turno</span>
                                <span className="col-span-1">Salário</span>
                                <span className="col-span-1 text-center">Ações</span>
                            </li>

                            {paginatedTeachers.length === 0 ? (
                                <li className="p-4 text-center text-slate-500">
                                    Nenhum professor encontrado.
                                </li>
                            ) : (
                                paginatedTeachers.map((teacher) => (
                                    <li
                                        key={teacher.id}
                                        onClick={() => navigate(`/professores/${teacher.id}`)} // Navegação ao clicar na linha
                                        className="grid grid-cols-7 gap-4 p-3 text-sm items-center cursor-pointer hover:bg-slate-50 transition"
                                    >
                                        <span className="col-span-3 font-medium flex flex-col">
                                            {teacher.nome}
                                            <span className={`text-[10px] w-fit px-2 rounded-full ${teacher.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {teacher.status}
                                            </span>
                                        </span>

                                        <span className="col-span-2 text-slate-500">
                                            {teacher.turno || "—"}
                                        </span>

                                        <span className="col-span-1 text-slate-600">
                                            {formatarParaBRL(teacher.salario)}
                                        </span>

                                        <div className="col-span-1 flex justify-center gap-2">
                                            <ActionBtn
                                                icon={Pencil}
                                                color="text-blue-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/professores/editar/${teacher.id}`);
                                                }}
                                            />
                                            <ActionBtn
                                                icon={Trash}
                                                color="text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(teacher.id);
                                                }}
                                            />
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}

                {/* Paginação */}
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

// Mini componente reutilizável (igual ao de Alunos)
const ActionBtn = ({ icon: Icon, color, onClick }) => (
    <button
        onClick={onClick}
        className={`p-1.5 rounded hover:bg-gray-100 transition ${color}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);