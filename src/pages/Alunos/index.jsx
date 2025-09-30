import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button"; // sem chaves, assumindo export default
import { Container, Paragraph, Title } from "../../components/Container";
import {
    ChevronLeftIcon,
    Eye,
    Pencil,
    Trash,
    User,
    UserRoundPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatarParaBRL } from "../../utils/format";

export function Alunos() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]); //? ESTADO PARA LISTAR ESTUDANTE
    const [searchTerm, setSearchTerm] = useState(""); //? ESTADO PARA REALIZAR A PESQUISA

    useEffect(() => {
        async function getStudents() {
            try {
                const { data } = await api.get("/alunos");
                setStudents(data);
            } catch (error) {
                console.error("Erro ao buscar alunos:", error.message);
                alert("Erro ao carregar alunos.");
            }
        }
        getStudents();
    }, []);

    //! FUNÇÃO PARA PESQUISAR !//

    const filteredStudents = searchTerm
        ? students.filter(
            (student) =>
                student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : students;

    //! FUNÇÃO DE DELETAR ALUNO !//
    async function handleDelete(id) {
        const senha = prompt("Digite a senha para excluir o aluno:");
        const senhaCorreta = import.meta.env.VITE_SENHA_EXCLUSAO;
        if (senha !== senhaCorreta) {
            alert("Senha incorreta. Exclusão cancelada.");
            return;
        }

        const confirm = window.confirm(
            "Tem certeza que deseja excluir este aluno?"
        );
        if (!confirm) return;

        try {
            await api.delete(`/alunos/${id}`);
            setStudents((prev) => prev.filter((student) => student.id !== id));
            alert("Aluno excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir aluno:", error.message);
            alert("Erro ao excluir aluno.");
        }
    }

    return (
        <Container>
            {/* Botões nos extremos */}
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" />
                </Button>
                <Button onClick={() => navigate("/alunos/cadastrar")}>
                    <UserRoundPlus className="w-5 h-5" />
                </Button>
            </div>

            {/* Título e parágrafo centralizados */}
            <div className="mb-8">
                <Title level={1} className="text-center">
                    Alunos
                </Title>
                <Paragraph muted className="text-center mt-2">
                    Informações sobre os alunos serão exibidas aqui:
                </Paragraph>

                <div className="mb-6 flex justify-end">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou responsável..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-sm p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="overflow-x-auto">
                    <ul className="min-w-[700px] divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
                        {" "}
                        {/* Cabeçalho */}
                        <li
                            key="header"
                            className="grid grid-cols-8 gap-4 p-3 bg-slate-100 font-medium text-slate-600 text-xs uppercase tracking-wide"
                        >
                            <span className="col-span-1">Mat.</span>
                            <span className="col-span-2">Nome</span>
                            <span className="col-span-2">Responsável</span>
                            <span className="col-span-1">Mensalidade</span>
                            <span className="col-span-1">Status</span>
                            <span className="col-span-1 text-center">Ações</span>
                        </li>


                        {/* Linhas */}
                        {filteredStudents.map((student) => (
                            <li
                                key={student.id}
                                className="grid grid-cols-8 gap-4 p-3 text-sm odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <span className="col-span-1 text-slate-500">{student.id}</span>
                                <span className="col-span-2 font-medium text-slate-800">{student.nome}</span>
                                <span className="col-span-2 text-slate-500">{student.responsavel}</span>
                                <span className="col-span-1 text-slate-500">{formatarParaBRL(student.valor_mensalidade)}</span>
                                <span className="col-span-1 font-semibold text-green-600">{student.status}</span>
                                <span className="col-span-1 flex justify-center gap-2">
                                    <button
                                        aria-label="Editar aluno"
                                        onClick={() => navigate(`/alunos/editar/${student.id}`)}
                                        className="p-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                    >
                                        <Pencil className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <button
                                        aria-label="Excluir aluno"
                                        onClick={() => handleDelete(student.id)}
                                        className="p-2 rounded-md hover:bg-red-50 transition"
                                    >
                                        <Trash className="w-4 h-4 text-red-500" />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/alunos/${student.id}`)}
                                        className="p-2 rounded-md hover:bg-slate-200 transition"
                                    >
                                        <Eye className="w-4 h-4 text-slate-600" />
                                    </button>
                                </span>
                            </li>

                        ))}
                        {filteredStudents.length === 0 && (
                            <p className="text-center text-sm text-slate-500 mt-4 mb-4">
                                Nenhum aluno encontrado com esse termo.
                            </p>
                        )}
                    </ul>
                </div>
            </div>
        </Container>
    );
}
