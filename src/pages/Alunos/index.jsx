import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, UserRoundPlus, Search } from "lucide-react";
import { useAlunos } from "../../hooks/useAlunos";
import { AlunoRow } from "./components/AlunoRow";
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import { paginate } from "../../utils/paginate";

export function Alunos() {
    const navigate = useNavigate();
    const {
        students, searchTerm, setSearchTerm, showInactive, setShowInactive,
        turnoFilter, setTurnoFilter, currentPage, setCurrentPage,
        isLoading, itemsPerPage, handleDelete
    } = useAlunos();

    const paginated = paginate(students, currentPage, itemsPerPage);
    const totalPages = Math.ceil(students.length / itemsPerPage);

    return (
        <Container>
            <header className="flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={() => navigate("/")}><ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar</Button>
                <Title level={1} className="!mb-0">Gestão de Alunos</Title>
                <Button onClick={() => navigate("/alunos/cadastrar")} className="bg-blue-600 text-white"><UserRoundPlus className="w-5 h-5" /></Button>
            </header>

            {/* Barra de Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text" placeholder="Buscar aluno..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={turnoFilter} onChange={(e) => setTurnoFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                    >
                        <option value="todos">Todos os turnos</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                    </select>
                    <button
                        onClick={() => setShowInactive(!showInactive)}
                        className={`px-4 py-2 text-sm rounded-lg border transition ${showInactive ? "bg-red-50 text-red-600 border-red-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}
                    >
                        {showInactive ? "Inativos" : "Ativos"}
                    </button>
                </div>
            </div>

            {/* Listagem */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <ul className="divide-y divide-slate-100">
                    <li className="grid grid-cols-7 gap-4 p-3 bg-slate-50 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                        <span className="col-span-3">Nome do Aluno</span>
                        <span className="col-span-2">Responsável</span>
                        <span className="col-span-1">Mensalidade</span>
                        <span className="col-span-1 text-center">Ações</span>
                    </li>
                    {isLoading ? (
                        <div className="p-10 text-center animate-pulse text-slate-400">Carregando alunos...</div>
                    ) : paginated.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">Nenhum aluno encontrado.</div>
                    ) : (
                        paginated.map(s => <AlunoRow key={s.id} student={s} navigate={navigate} onDelete={handleDelete} />)
                    )}
                </ul>
            </div>

            {/* Paginação Simplificada */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Anterior</Button>
                    <span className="text-sm font-medium text-slate-500">Página {currentPage} de {totalPages}</span>
                    <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Próxima</Button>
                </div>
            )}
        </Container>
    );
}