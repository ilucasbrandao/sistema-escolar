import dayjs from "dayjs";
import api from "../../services/api.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Paragraph, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { ChevronLeftIcon, Eye } from "lucide-react";
import { formatarParaBRL } from "../../utils/format.js";

function formatarDataLegivel(dataISO) {
    if (!dataISO || !dayjs(dataISO).isValid()) return "-";
    return dayjs(dataISO).format("DD/MM/YYYY");
}

export default function VisualizarDadosFuncionario() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [movimentacoes, setMovimentacoes] = useState([]);

    useEffect(() => {
        async function getTeacherById() {
            try {
                const { data } = await api.get(`/professores/${id}`);
                setTeacher(data);
                setMovimentacoes(data.movimentacoes || []);
            } catch (error) {
                alert("Não foi possível carregar os dados do professor(a).");
                console.error("Erro ao buscar professor(a):", error);
            }
        }
        getTeacherById();
    }, [id]);

    if (!teacher) {
        return (
            <Container className="flex justify-center items-center min-h-screen">
                <p className="text-slate-500 text-sm">Carregando dados do professor(a)...</p>
            </Container>
        );
    }

    return (
        <Container>
            {/* Botão voltar */}
            <div className="mb-4">
                <Button onClick={() => navigate("/professores")} className="flex items-center gap-2">
                    <ChevronLeftIcon className="w-5 h-5" />
                </Button>
            </div>

            {/* Título */}
            <div className="mb-6 text-center">
                <Title level={1}>Dados do Professor(a)</Title>
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mt-2">{teacher.nome}</h2>
            </div>

            {/* Informações */}
            <div className="max-w-xl mx-auto bg-white shadow-sm rounded-md p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-700">
                    <label className="font-medium">ID:</label>
                    <span>{teacher.id}</span>

                    <label className="font-medium">Nome:</label>
                    <span>{teacher.nome}</span>

                    <label className="font-medium">Data de Nascimento:</label>
                    <span>{formatarDataLegivel(teacher.data_nascimento)}</span>

                    <label className="font-medium">Salário:</label>
                    <span className="font-semibold text-blue-700">{teacher.salario}</span>

                    <label className="font-medium">Telefone:</label>
                    <span>{teacher.telefone}</span>

                    <label className="font-medium">Data da Contratação:</label>
                    <span>{formatarDataLegivel(teacher.data_contratacao)}</span>

                    <label className="font-medium">Nível de Ensino:</label>
                    <span>{teacher.nivel_ensino}</span>

                    <label className="font-medium">Turno:</label>
                    <span>{teacher.turno}</span>

                    <label className="font-medium">Status:</label>
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

            {/* Histórico de pagamentos */}
            <div className="max-w-xl mx-auto mt-8">
                <Title level={2} className="text-lg font-semibold text-slate-800 mb-4">
                    Histórico de Pagamentos
                </Title>
                {movimentacoes.length === 0 ? (
                    <Paragraph muted className="text-sm text-slate-600">
                        Nenhuma movimentação registrada.
                    </Paragraph>
                ) : (
                    <ul className="space-y-2">
                        {movimentacoes.map((mov) => (
                            <li
                                key={mov.id_despesa}
                                className="bg-slate-50 p-3 rounded-md shadow-sm flex justify-between items-center"
                            >
                                <div className="text-sm text-slate-700">
                                    <p><strong>Mês:</strong> {mov.mes_referencia}</p>
                                    <p><strong>Valor:</strong> {formatarParaBRL(mov.valor)}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        navigate(`/professores/${teacher.id}/despesas/${mov.id_despesa}`)
                                    }
                                    className="p-2 rounded hover:bg-slate-200"
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
