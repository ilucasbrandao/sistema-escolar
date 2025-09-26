import { useEffect, useState } from "react";
import api from "../../services/api.js"
import { useNavigate } from "react-router-dom";
import { Container, Paragraph, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { ChevronLeftIcon, Eye, Pencil, Trash, UserRoundPlus } from "lucide-react";


export function Professores() {
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function getTeacher() {
            try {
                const { data } = await api.get("/professores");
                setTeacher(data);
            } catch (error) {
                console.error("Erro ao buscar professores:", error.message);
                alert("Erro ao carregar professores.");
            }
        }
        getTeacher();
    }, []);

    //! FUNÇÃO PARA PESQUISAR !//
    const filteredTeachers = teacher.filter((teacher) =>
        teacher.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )

    //! FUNÇÃO DE DELETAR ALUNO !//
    async function handleDelete(id) {

        const senha = prompt("Digite a senha para excluir o professor(a): ")
        if (senha !== "JulianneKelly2025") {
            alert("Senha incorreta. Exclusão cancelada.");
            return;
        }
        const confirm = window.confirm("Tem certeza que deseja excluir este professor(a)?")
        if (!confirm) return;

        try {
            await api.delete(`/professores/${id}`);
            setTeacher((prev) => prev.filter((teacher) => teacher.id !== id));
            alert("Professor(a) excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir professor(a):", error.message);
            alert("Erro ao excluir professor(a).");
        }
    }

    return (
        <Container>
            {/* Botões nos extremos */}
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" />
                </Button>
                <Button onClick={() => navigate("/professores/cadastrar")}>
                    <UserRoundPlus className="w-5 h-5" />
                </Button>
            </div>
            <div className="text-center">
                <Title level={1}>Professores</Title>
                <Paragraph mute className="mt-4">
                    Informações sobre os professores serão exibidas aqui:
                </Paragraph>

                <div className="mt-6 mb-4 flex justify-end">
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md w-72 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    />
                </div>

                <ul className="divide-y divide-gray-200 rounded-lg border border-gray-300 bg-white shadow-md mt-6">
                    {/* Cabeçalho */}
                    <li className="grid grid-cols-7 gap-4 p-3.5 bg-gray-50 font-semibold text-gray-600 text-sm uppercase">
                        <span>Id</span>
                        <span>Nome</span>
                        <span>Salário</span>
                        <span>Status</span>
                        <span className="text-center">Editar</span>
                        <span className="text-center">Excluir</span>
                        <span className="text-center">Ver</span>
                    </li>

                    {/* Linhas */}
                    {filteredTeachers.map((teacher) => (
                        <li
                            key={teacher.id}
                            className="grid grid-cols-7 gap-4 p-3.5 hover:bg-gray-100 items-center text-sm"
                        >
                            <span className="text-gray-500">{teacher.id}</span>
                            <span className="font-semibold text-gray-800">
                                {teacher.nome}
                            </span>
                            <span className="font-semibold text-gray-800">
                                {teacher.salario}
                            </span>
                            <span
                                className={`${teacher.status === "ativo"
                                    ? "text-green-600 font-semibold"
                                    : "text-red-600 font-semibold"
                                    }`}
                            >
                                {teacher.status}
                            </span>
                            <span
                                onClick={() => navigate(`/professores/editar/${teacher.id}`)}
                                className="flex justify-center"
                            >
                                <Pencil className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800" />
                            </span>
                            <span
                                onClick={() => handleDelete(teacher.id)}
                                className="flex justify-center"
                            >
                                <Trash className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800" />
                            </span>

                            <span
                                onClick={() => navigate(`/professores/${teacher.id}`)}
                                className="flex justify-center"
                            >
                                <Eye className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
                            </span>
                        </li>
                    ))}



                </ul>








            </div>




        </Container>
    )










}