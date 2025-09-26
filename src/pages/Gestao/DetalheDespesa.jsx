import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { Container, Paragraph } from "../../components/Container";
import { ChevronLeftIcon, Trash } from "lucide-react";

function formatarDataLegivel(dataISO) {
    if (!dataISO || !dayjs(dataISO).isValid()) return "—";
    return dayjs(dataISO).format("DD/MM/YYYY");
}
export default function VisualizarDespesa() {
    const navigate = useNavigate();
    const { professorId, despesaId } = useParams();
    const [despesa, setDespesa] = useState(null);

    useEffect(() => {
        async function carregarDespesas() {
            try {
                const response = await api.get(
                    `/despesa/professor/${professorId}/${despesaId}`
                );
                setDespesa(response.data);
            } catch (error) {
                console.error("Erro ao buscar despesa:", error);
            }
        }
        carregarDespesas();
    }, [professorId, despesaId]);

    async function handleDelete() {
        const senha = prompt("Digite a senha para excluir esta mensalidade:");
        const senhaCorreta = import.meta.env.VITE_SENHA_EXCLUSAO;
        if (senha !== senhaCorreta) {
            alert("Senha incorreta. Exclusão cancelada.");
            return;
        }
        const confirm = window.confirm(
            "Tem certeza que deseja excluir esta mensalidade?"
        );
        if (!confirm) return;

        try {
            await api.delete(`/despesa/${despesaId}`);
            alert("Despesa excluída com sucesso!");
            navigate(`/professores/${professorId}`);
        } catch (error) {
            console.error("Erro ao excluir despesa:", error);
            alert("Erro ao excluir despesa.");
        }
    }

    if (!despesa) {
        return (
            <Container className="flex justify-center items-center h-full">
                <p>Carregando mensalidade...</p>
            </Container>
        );
    }

    return (
        <Container>
            {/* Botão voltar */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(`/professores/${professorId}`)}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                >
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </button>
            </div>

            {/* Dados da mensalidade */}
            <Container className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                <div className="flex flex-col gap-1">
                    <Paragraph>
                        <strong>Valor: </strong> R$ {despesa.valor}
                    </Paragraph>
                    <Paragraph>
                        <strong>Data de Pagamento: </strong>{" "}
                        {formatarDataLegivel(despesa.data_pagamento)}
                    </Paragraph>
                    <Paragraph>
                        <strong>Mês Referente: </strong> {despesa.mes_referencia}/
                        {despesa.ano_referencia}
                    </Paragraph>
                    <Paragraph>
                        <strong>Status: </strong> {despesa.status}
                    </Paragraph>
                </div>

                <button
                    onClick={handleDelete}
                    className="flex items-center justify-center p-2 rounded-md hover:bg-red-100 transition"
                    title="Excluir Mensalidade"
                >
                    <Trash className="w-5 h-5 text-red-600" />
                </button>
            </Container>
        </Container>
    );
}
