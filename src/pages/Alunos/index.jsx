import { useNavigate } from "react-router-dom";
import {
    ChevronLeftIcon,
    UserRoundPlus,
    Search,
    X,
    Users,
    FilterX,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useAlunos } from "../../hooks/useAlunos";
import { AlunoRow } from "./components/AlunoRow";
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import { paginate } from "../../utils/paginate";

export function Alunos() {
    const navigate = useNavigate();
    const {
        students,
        searchTerm,
        setSearchTerm,
        showInactive,
        setShowInactive,
        turnoFilter,
        setTurnoFilter,
        serieFilter,       // Filtro de Série
        setSerieFilter,
        professorFilter,   // Filtro de Professor
        setProfessorFilter,
        professoresList,   // Lista de professores vinda do backend/hook
        seriesList,        // Lista de séries vinda do backend/hook ou estática
        currentPage,
        setCurrentPage,
        isLoading,
        itemsPerPage,
        handleDelete
    } = useAlunos();

    const paginated = paginate(students, currentPage, itemsPerPage);
    const totalPages = Math.ceil(students.length / itemsPerPage);

    // Verifica se há algum filtro ativo para exibir o botão de limpar
    const temFiltroAtivo =
        searchTerm ||
        turnoFilter !== "todos" ||
        (serieFilter && serieFilter !== "todas") ||
        (professorFilter && professorFilter !== "todos") ||
        showInactive;

    const limparFiltros = () => {
        setSearchTerm("");
        setTurnoFilter("todos");
        if (setSerieFilter) setSerieFilter("todas");
        if (setProfessorFilter) setProfessorFilter("todos");
        setShowInactive(false);
        setCurrentPage(1);
    };

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
                            Gestão de Alunos
                        </Title>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Filtre por turno, série ou professor responsável
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => navigate("/alunos/cadastrar")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2"
                >
                    <UserRoundPlus className="w-5 h-5" />
                    <span>Novo Aluno</span>
                </Button>
            </header>

            {/* Barra de Filtros Compacta */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap lg:flex-nowrap gap-3 items-center justify-between">

                {/* 1. Busca Compacta (Largura máxima limitada) */}
                <div className="relative w-full sm:w-64 lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por aluno/resp..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
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

                {/* 2. Grupo de Seletores de Filtro */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">

                    {/* Filtro por Horário / Turno */}
                    <select
                        value={turnoFilter}
                        onChange={(e) => {
                            setTurnoFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition"
                    >
                        <option value="todos">Todos os Horários</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noite">Noite</option>
                    </select>

                    {/* Filtro por Série */}
                    <select
                        value={serieFilter || "todas"}
                        onChange={(e) => {
                            if (setSerieFilter) setSerieFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition"
                    >
                        <option value="todas">Todas as Séries</option>
                        {seriesList ? (
                            seriesList.map((serie) => (
                                <option key={serie} value={serie}>{serie}</option>
                            ))
                        ) : (
                            <>
                                <option value="Educação Infantil">Educação Infantil</option>
                                <option value="1º Ano">1º Ano</option>
                                <option value="2º Ano">2º Ano</option>
                                <option value="3º Ano">3º Ano</option>
                                <option value="4º Ano">4º Ano</option>
                                <option value="5º Ano">5º Ano</option>
                                <option value="6º ao 9º Ano">6º ao 9º Ano</option>
                            </>
                        )}
                    </select>

                    {/* Filtro por Professor */}
                    <select
                        value={professorFilter || "todos"}
                        onChange={(e) => {
                            if (setProfessorFilter) setProfessorFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition max-w-[160px] truncate"
                    >
                        <option value="todos">Todos os Professores</option>
                        {professoresList?.map((prof) => (
                            <option key={prof.id} value={prof.id}>
                                {prof.nome}
                            </option>
                        ))}
                    </select>

                    {/* Toggle de Status (Ativos / Inativos) */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                        <button
                            type="button"
                            onClick={() => {
                                setShowInactive(false);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${!showInactive
                                ? "bg-white text-blue-600 shadow-xs"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            Ativos
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowInactive(true);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${showInactive
                                ? "bg-rose-500 text-white shadow-xs"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            Inativos
                        </button>
                    </div>

                    {/* Botão de Limpar Filtros (só aparece se houver filtro aplicado) */}
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
                    Exibindo {students.length} aluno{students.length !== 1 ? "s" : ""}
                </span>
                {totalPages > 1 && (
                    <span>Página {currentPage} de {totalPages}</span>
                )}
            </div>

            {/* Tabela de Alunos */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <ul className="divide-y divide-slate-100">
                    <li className="grid grid-cols-7 gap-4 px-5 py-3.5 bg-slate-50/80 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                        <span className="col-span-3">Nome do Aluno</span>
                        <span className="col-span-2">Responsável</span>
                        <span className="col-span-1">Mensalidade</span>
                        <span className="col-span-1 text-center">Ações</span>
                    </li>

                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-sm text-slate-400">Carregando lista de alunos...</p>
                        </div>
                    ) : paginated.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-500 font-medium">Nenhum aluno encontrado</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Tente ajustar a busca ou limpar os filtros selecionados.
                            </p>
                        </div>
                    ) : (
                        paginated.map((student) => (
                            <AlunoRow
                                key={student.id}
                                student={student}
                                navigate={navigate}
                                onDelete={handleDelete}
                            />
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