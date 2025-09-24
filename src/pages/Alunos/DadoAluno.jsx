import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { Container, Paragrafos, TitleH1 } from "../../components/Container";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import dayjs from "dayjs";

// Função para formatar data ISO → DD/MM/YYYY
function formatarDataLegivel(dataISO) {
    if (!dataISO || !dayjs(dataISO).isValid()) return "—";
    return dayjs(dataISO).format("DD/MM/YYYY");
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
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-medium text-center text-blue-700 tracking-tight mb-6">
                    {student.nome}
                </h3>
            </div>

            {/* Informações */}
            <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="font-semibold text-gray-700">ID:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.id}</span>

                    <label className="font-semibold text-gray-700">Nome:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.nome}</span>

                    <label className="font-semibold text-gray-700">Data de Nascimento:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {formatarDataLegivel(student.data_nascimento)}
                    </span>

                    <label className="font-semibold text-gray-700">Responsável:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.responsavel}</span>

                    <label className="font-semibold text-gray-700">Telefone:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.telefone}</span>

                    <label className="font-semibold text-gray-700">Data da Matrícula:</label>
                    <span className="text-sm sm:text-base text-gray-800">
                        {formatarDataLegivel(student.data_matricula)}
                    </span>

                    <label className="font-semibold text-gray-700">Série:</label>
                    <span className="text-sm sm:text-base text-gray-800">{student.serie}</span>

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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Pagamentos</h3>
                {movimentacoes.length === 0 ? (
                    <Paragrafos className="text-gray-600">Nenhuma movimentação registrada.</Paragrafos>
                ) : (
                    <ul className="space-y-2">
                        {movimentacoes.map((mov, i) => (
                            <li key={i} className="bg-gray-50 p-3 rounded shadow-sm">
                                <Paragrafos><strong>Valor: </strong> R$ {mov.valor}</Paragrafos>
                                <Paragrafos><strong>Data: </strong>{formatarDataLegivel(mov.data_pagamento)}</Paragrafos>
                                <Paragrafos><strong>Mês Referente: </strong> {mov.mes_referencia}</Paragrafos>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Container>
    );
}
