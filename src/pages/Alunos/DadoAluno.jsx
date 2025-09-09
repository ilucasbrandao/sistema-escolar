import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { Container, TitleH1 } from "../../components/Container";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";

export default function VisualizarDados() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [student, setStudent] = useState(null);

    function formatDate(date) {
        if (!date) return "";

        // Se estiver no formato YYYY-MM-DD
        if (date.includes("-")) {
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        }

        // Se estiver no formato DD/MM/YYYY, retorna como está
        if (date.includes("/")) {
            return date;
        }

        return "Data inválida";
    }

    useEffect(() => {
        async function getStudentById() {
            try {
                const { data } = await api.get(`/alunos/${id}`);
                setStudent(data);
            } catch (error) {
                console.error("Erro ao buscar aluno:", error);
            }
        }
        getStudentById();
    }, [id]);

    if (!student) {
        return (
            <Container className="flex justify-center items-center h-full">
                <p>Carregando dados do aluno...</p>
            </Container>
        );
    }

    return (
        <Container>
            {/* Botão voltar */}
            <div className="mb-6">
                <Button
                    onClick={() => navigate("/alunos")}
                    className="flex items-center gap-2"
                >
                    <ChevronLeftIcon className="w-5 h-5" />

                </Button>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
                <TitleH1>Dados do Aluno</TitleH1>

                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-medium text-center text-blue-700 tracking-tight mb-6">{student.name}</h3>
            </div>

            {/* Formulário */}
            <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="font-semibold text-gray-700">ID:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.id}</span>

                    <label className="font-semibold text-gray-700">Nome:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.name}</span>

                    <label className="font-semibold text-gray-700">Data de Nascimento:</label>
                    <span className="text-sm sm:text-base text-gray-800">{formatDate(student.dataNascimento)}</span>

                    <label className="font-semibold text-gray-700">Responsável:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.responsavel}</span>

                    <label className="font-semibold text-gray-700">Telefone:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.telefone}</span>

                    <label className="font-semibold text-gray-700">Data da Matrícula:</label>
                    <span className="text-sm sm:text-base text-gray-800">{formatDate(student.dataMatricula)}</span>

                    <label className="font-semibold text-gray-700">Série:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.serie}</span>

                    <label className="font-semibold text-gray-700">Observação:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.observacao || "—"}</span>

                    <label className="font-semibold text-gray-700">Situação:</label>
                    <span
                        className={`font-semibold ${student.situacao === "ativo" ? "text-sm sm:text-base text-green-600" : "text-sm sm:text-base text-red-600"
                            }`}
                    >
                        {student.situacao}
                    </span>
                </div>
            </div>
        </Container>
    );
}
