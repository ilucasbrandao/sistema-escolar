import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button"; // sem chaves, assumindo export default
import { Container, Paragrafos, TitleH1 } from "../../components/Container";
import { ChevronLeftIcon, Eye, Pencil, User, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";

export function Alunos() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        async function getStudents() {
            const { data } = await api.get("/alunos");
            setStudents(data);
        }
        getStudents();
    }, []);

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
            <div className="text-center">
                <TitleH1>Alunos</TitleH1>
                <Paragrafos className="mt-4">
                    Informações sobre os alunos serão exibidas aqui:
                </Paragrafos>

                <ul className="divide-y divide-gray-200 rounded-lg border border-gray-300 bg-white shadow-md mt-6">
                    {/* Cabeçalho */}
                    <li className="grid grid-cols-6 gap-4 p-3.5 bg-gray-50 font-semibold text-gray-600 text-sm uppercase">
                        <span>Mat.</span>
                        <span>Nome</span>
                        <span>Responsável</span>
                        <span>Situação</span>
                        <span className="text-center">Editar</span>
                        <span className="text-center">Ver</span>
                    </li>

                    {/* Linhas */}
                    {students.map((student) => (
                        <li
                            key={student.id}
                            className="grid grid-cols-6 gap-4 p-3.5 hover:bg-gray-100 items-center text-sm"
                        >
                            <span className="text-gray-500">{student.id}</span>
                            <span className="font-semibold text-gray-800">{student.name}</span>
                            <span className="text-gray-500">{student.responsavel}</span>
                            <span
                                className={`${student.situacao === "ativo"
                                    ? "text-green-600 font-semibold"
                                    : "text-red-600 font-semibold"
                                    }`}
                            >
                                {student.situacao}
                            </span>
                            <span className="flex justify-center">
                                <Pencil className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800" />
                            </span>
                            <span onClick={() => navigate(`/alunos/${student.id}`)} className="flex justify-center">
                                <Eye className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </Container>
    );
}
