import dayjs from "dayjs";
import api from "../../services/api.js"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import { formatarParaBRL } from "../../utils/format.js";

function formatarDataLegivel(dataISO) {
    if (!dataISO || !dayjs(dataISO).isValid()) return "-";
    return dayjs(dataISO).format("DD/MM/YYYY");
}

export default function VisualizarDadosFuncionario() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);

    useEffect(() => {
        async function getTeacherById() {
            try {
                const { data } = await api.get(`/professores/${id}`);
                setTeacher(data);
                console.log(data)
            } catch (error) {
                console.error("Erro ao buscar professor(a) ", error);
            }
        }
        getTeacherById();
    }, [id]);

    if (!teacher) {
        return (
            <Container className="flex justify-center items-center h-full">
                <p>Carregando dados do aluno...</p>
            </Container>
        )
    }


    return (
        <Container>
            {/* Botão voltar */}
            <div className="mb-6">
                <Button
                    onClick={() => navigate("/professores")}
                    className="flex items-center gap-2"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </Button>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
                <Title level={1}>Dados do Professor(a)</Title>
                <Title level={3} className="text-2xl sm:text-4xl lg:text-5xl font-medium text-center text-blue-700 tracking-tight mb-6">
                    {teacher.nome}
                </Title>
            </div>

            {/* Informações */}
            <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="font-semibold text-gray-700">ID:</label>
                    <span className="text-sm sm:text-base text-gray-800">{teacher.id}</span>

                    <label className="font-semibold text-gray-700">Nome:</label>
                    <span className="text-sm sm:text-base text-gray-800">{teacher.nome}</span>

                    <label className="font-semibold text-gray-700">Data de Nascimento:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {formatarDataLegivel(teacher.data_nascimento)}
                    </span>

                    <label className="font-semibold text-gray-700">Salário (R$):</label>
                    <span>{formatarParaBRL(teacher.salario)}</span>


                    <label className="font-semibold text-gray-700">Telefone:</label>
                    <span className="text-sm sm:text-base text-gray-800">{teacher.telefone}</span>

                    <label className="font-semibold text-gray-700">Data da Contratação:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {formatarDataLegivel(teacher.data_contratacao)}
                    </span>

                    <label className="font-semibold text-gray-700">Nível de Série:</label>
                    <span className="text-sm sm:text-base text-gray-800">{teacher.nivel_ensino}</span>

                    <label className="font-semibold text-gray-700">Turno:</label>
                    <span className="text-sm sm:text-base text-gray-800">{teacher.turno}</span>

                    <label className="font-semibold text-gray-700">Status:</label>
                    <span
                        className={`font-semibold ${teacher.status === "ativo"
                            ? "text-sm sm:text-base text-green-600"
                            : "text-sm sm:text-base text-red-600"
                            }`}
                    >
                        {teacher.status}
                    </span>
                </div>
            </div>

        </Container>
    )

}
