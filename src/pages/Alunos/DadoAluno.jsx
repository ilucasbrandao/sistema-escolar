import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { Container, Paragraph, Title } from "../../components/Container";
import { ChevronLeftIcon, Eye } from "lucide-react";
import api from "../../services/api";
import dayjs from "dayjs";
import { formatarParaBRL } from "../../utils/format";

// Função para formatar data ISO → DD/MM/YYYY
function formatarDataLegivel(dataISO) {
    if (!dataISO) return "—";
    // Se vier "2025-10-03T00:00:00.000Z", pega só a parte do ano-mês-dia
    const diaMesAno = dataISO.split("T")[0] || dataISO;
    const [ano, mes, dia] = diaMesAno.split("-");
    return `${dia}/${mes}/${ano}`;
}

function idadeEmAnos(dataNascimentoISO) {
    if (!dataNascimentoISO) return "-";
    const nascimento = dayjs(dataNascimentoISO);
    const hoje = dayjs();
    return hoje.diff(nascimento, 'year');
}


export default function VisualizarDados() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [movimentacoes, setMovimentacoes] = useState([]);

    useEffect(() => {
        async function getStudentById() {
            try {
                const { data } = await api.get(`/alunos/${id}`);
                setStudent(data);
                setMovimentacoes(data.movimentacoes || []);
            } catch (error) {
                alert("Não foi possível carregar os dados do aluno.");
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
                    Voltar
                </Button>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
                <Title level={1}>Dados do Aluno</Title>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-medium text-center text-blue-700 tracking-tight mb-6">
                    {student.nome}
                </h3>
            </div>

            {/* Informações */}
            <div className="max-w-xl mx-auto bg-white shadow-sm rounded-md p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <label className="font-semibold text-gray-700">ID:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {student.id}
                    </span>

                    <label className="font-semibold text-gray-700">Nome:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {student.nome}
                    </span>

                    <label className="font-semibold text-gray-700">
                        Data de Nascimento:
                    </label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {formatarDataLegivel(student.data_nascimento)} - {idadeEmAnos(student.data_nascimento) + " anos"}
                    </span>

                    <label className="font-semibold text-gray-700">Responsável:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {student.responsavel}
                    </span>

                    <label className="font-semibold text-gray-700">Telefone:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {student.telefone}
                    </span>

                    <label className="font-semibold text-gray-700">
                        Data da Matrícula:
                    </label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {formatarDataLegivel(student.data_matricula)}
                    </span>
                    <label className="font-semibold text-gray-700">
                        Mensalidade (R$):
                    </label>
                    <span className="text-sm sm:text-base text-blue-700 font-semibold">
                        {formatarParaBRL(student.valor_mensalidade)}
                    </span>

                    <label className="font-semibold text-gray-700">Série:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {student.serie}
                    </span>
                    <label className="font-semibold text-gray-700">Turno:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {student.turno === "Manha" ? "Manhã" : student.turno}
                    </span>

                    <label className="font-semibold text-gray-700">Observação:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {student.observacao || "—"}
                    </span>

                    <label className="font-semibold text-gray-700">Status:</label>
                    <span
                        className={`font-semibold ${student.status === "ativo"
                            ? "text-sm sm:text-base text-green-600"
                            : "text-sm sm:text-base text-red-600"
                            }`}
                    >
                        {student.status}
                    </span>
                </div>
            </div>

            <div className="max-w-xl mx-auto mt-8">
                <Title level={2} className="text-xl font-semibold text-gray-800 mb-4">
                    Histórico de Pagamentos
                </Title>
                {movimentacoes.length === 0 ? (
                    <Paragraph muted className="text-gray-600">
                        Nenhuma movimentação registrada.
                    </Paragraph>
                ) : (
                    <ul className="space-y-2">
                        {movimentacoes.map((mov) => (
                            <li
                                key={mov.id_mensalidade || mov.id}
                                className="bg-slate-50 p-3 rounded-md shadow-sm flex justify-between items-center"
                            >
                                <div className="text-sm text-slate-700">
                                    <p>
                                        <strong>Mês:</strong> {mov.mes_referencia}
                                    </p>
                                    <p>
                                        <strong>Valor:</strong> {formatarParaBRL(mov.valor)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        navigate(
                                            `/alunos/${student.id}/receitas/${mov.id_mensalidade}`
                                        )
                                    }
                                    className="p-1.5 rounded hover:bg-slate-200"
                                >
                                    <Eye className="w-4 h-4 text-slate-600" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Container>
    );
}
