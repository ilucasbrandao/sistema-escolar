import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeftIcon,
    Pencil,
    Trash2,
    UserRoundPlus,
    Search,
    X,
    Users,
    FilterX,
    ChevronLeft,
    ChevronRight,
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
    const [turnoFilter, setTurnoFilter] = useState("todos");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 10;

    // 1. Carga inicial de Professores da API
    useEffect(() => {
        let isMounted = true;

        async function getTeachers() {
            try {
                setIsLoading(true);
                const { data } = await api.get("/professores");
                if (isMounted) setTeachers(data);
            } catch (error) {
                console.error("❌ Erro ao buscar professores:", error.message);
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

    // Reset de página ao alterar qualquer filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showInactive, turnoFilter]);

    // 2. Filtragem e ordenação inteligente dos dados
    const filteredTeachers = useMemo(() => {
        return teachers
            .filter((teacher) => {
                const matchesSearch = teacher.nome
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                const matchesStatus = showInactive
                    ? teacher.status === "inativo"
                    : teacher.status === "ativo";

                const matchesTurno =
                    turnoFilter === "todos" ||
                    (teacher.turno &&
                        teacher.turno.toLowerCase() === turnoFilter.toLowerCase());

                return matchesSearch && matchesStatus && matchesTurno;
            })
            .sort((a, b) => a.nome.localeCompare(b.nome));
    }, [teachers, searchTerm, showInactive, turnoFilter]);

    const paginatedTeachers = paginate(
        filteredTeachers,
        currentPage,
        itemsPerPage
    );
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

    // Verificação de existência de filtros ativos
    const temFiltroAtivo =
        searchTerm !== "" || turnoFilter !== "todos" || showInactive;

    const limparFiltros = () => {
        setSearchTerm("");
        setTurnoFilter("todos");
        setShowInactive(false);
        setCurrentPage(1);
    };

    // 3. Exclusão de Professor
    async function handleDelete(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja remover este(a) professor(a)? Todas as credenciais de acesso associadas também serão removidas."
        );

        if (!confirmar) return;

        try {
            await api.delete(`/professores/${id}`);
            setTeachers((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            console.error("❌ Erro ao excluir professor:", error);
            alert("Erro ao excluir professor(a). Verifique se existem registros vinculados.");
        }
    }

    return (
        <Container>
            {/* Cabeçalho Superior */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Button>
                    <div>
                        <Title level={1} className="!mb-0 text-2xl font-bold text-slate-800">
                            Gestão de Professores
                        </Title>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Gerencie a equipe docente, turnos de atendimento e remunerações
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => navigate("/professores/cadastrar")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2"
                >
                    <UserRoundPlus className="w-5 h-5" />
                    <span>Novo Professor</span>
                </Button>
            </header>

            {/* Barra de Filtros Compacta e Padronizada */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap lg:flex-nowrap gap-3 items-center justify-between">

                {/* Busca por Nome */}
                <div className="relative w-full sm:w-64 lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por nome do professor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Grupo de Filtros */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">

                    {/* Filtro por Turno */}
                    <select
                        value={turnoFilter}
                        onChange={(e) => setTurnoFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition"
                    >
                        <option value="todos">Todos os Turnos</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noite">Noite</option>
                        <option value="Integral">Integral</option>
                    </select>

                    {/* Toggle de Status (Ativos / Inativos) */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                        <button
                            type="button"
                            onClick={() => setShowInactive(false)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${!showInactive
                                ? "bg-white text-blue-600 shadow-xs"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            Ativos
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowInactive(true)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${showInactive
                                ? "bg-rose-500 text-white shadow-xs"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            Inativos
                        </button>
                    </div>

                    {/* Botão para Limpar Filtros */}
                    {temFiltroAtivo && (
                        <button
                            onClick={limparFiltros}
                            title="Limpar todos os filtros"
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition flex items-center justify-center"
                        >
                            <FilterX className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Contador de Resultados */}
            <div className="flex items-center justify-between px-1 mb-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Exibindo {filteredTeachers.length} professor{filteredTeachers.length !== 1 ? "es" : ""}
                </span>
                {totalPages > 1 && (
                    <span>Página {currentPage} de {totalPages}</span>
                )}
            </div>

            {/* Tabela de Professores */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <ul className="divide-y divide-slate-100">
                    <li className="grid grid-cols-7 gap-4 px-5 py-3.5 bg-slate-50/80 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                        <span className="col-span-3">Nome do Professor</span>
                        <span className="col-span-2">Turno</span>
                        <span className="col-span-1">Salário</span>
                        <span className="col-span-1 text-center">Ações</span>
                    </li>

                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-sm text-slate-400">Carregando lista de professores...</p>
                        </div>
                    ) : paginatedTeachers.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-500 font-medium">Nenhum professor encontrado</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Tente ajustar a busca ou limpar os filtros selecionados.
                            </p>
                        </div>
                    ) : (
                        paginatedTeachers.map((teacher) => (
                            <li
                                key={teacher.id}
                                onClick={() => navigate(`/professores/${teacher.id}`)}
                                className="grid grid-cols-7 gap-4 px-5 py-3.5 text-sm items-center cursor-pointer hover:bg-slate-50/80 transition"
                            >
                                <span className="col-span-3 font-medium text-slate-800 flex items-center gap-2">
                                    {teacher.nome}
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${teacher.status === "ativo"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                            : "bg-rose-50 text-rose-700 border border-rose-200/60"
                                            }`}
                                    >
                                        {teacher.status}
                                    </span>
                                </span>

                                <span className="col-span-2 text-xs text-slate-500 font-medium">
                                    {teacher.turno || "—"}
                                </span>

                                <span className="col-span-1 text-xs font-semibold text-slate-700">
                                    {formatarParaBRL(teacher.salario)}
                                </span>

                                <div className="col-span-1 flex justify-center items-center gap-1">
                                    <ActionBtn
                                        icon={Pencil}
                                        title="Editar professor"
                                        color="text-blue-600 hover:bg-blue-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/professores/editar/${teacher.id}`);
                                        }}
                                    />
                                    <ActionBtn
                                        icon={Trash2}
                                        title="Excluir professor"
                                        color="text-rose-500 hover:bg-rose-50"
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

            {/* Paginação Estilizada */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs">
                        {currentPage} / {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </Container>
    );
}

// Subcomponente de Botão de Ação Reutilizável
const ActionBtn = ({ icon: Icon, color, onClick, title }) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className={`p-1.5 rounded-lg transition ${color}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);