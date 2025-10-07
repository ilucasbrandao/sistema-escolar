import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { Container, Paragraph, Title } from "../../components/Container";
import { ChevronLeftIcon, Trash } from "lucide-react";
import { Button } from "../../components/Button";

function formatarDataLegivel(dataISO) {
    if (!dataISO) return "—";
    const [ano, mes, dia] = dataISO.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
}


export default function VisualizarDespesa() {
    const navigate = useNavigate();
    const { professorId, despesaId } = useParams();
    const [despesa, setDespesa] = useState(null);

    useEffect(() => {
        async function carregarDespesas() {
            try {
                const response = await api.get(`/despesa/professor/${professorId}/${despesaId}`);
                setDespesa(response.data);
            } catch (error) {
                console.error("Erro ao buscar despesa:", error);
            }
        }
        carregarDespesas();
    }, [professorId, despesaId]);

    async function handleDelete() {
        const senha = prompt("Digite a senha para excluir esta despesa:");
        const senhaCorreta = import.meta.env.VITE_SENHA_EXCLUSAO;
        if (senha !== senhaCorreta) {
            alert("Senha incorreta. Exclusão cancelada.");
            return;
        }

        const confirm = window.confirm("Tem certeza que deseja excluir esta despesa?");
        if (!confirm) return;

        try {
            await api.delete(`/despesa/professor/${professorId}/${despesaId}`);
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
                <Paragraph muted>Carregando despesa...</Paragraph>
            </Container>
        );
    }

    return (
        <Container>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => navigate(`/professores/${professorId}`)} variant="neutral">
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </Button>
                <Title level={2}>Despesa</Title>
                <Button onClick={handleDelete} variant="danger" title="Excluir Despesa">
                    <Trash className="w-5 h-5" />
                </Button>
            </div>

            {/* Card de dados */}
            <div className="bg-white rounded-md shadow-sm p-4 space-y-2 text-sm text-slate-700">
                <Paragraph>
                    <strong>Valor:</strong> R$ {despesa.valor.toFixed(2).replace('.', ',')}
                </Paragraph>

                <Paragraph>
                    <strong>Data de Pagamento:</strong> {formatarDataLegivel(despesa.data_pagamento)}
                </Paragraph>
                <Paragraph>
                    <strong>Mês Referente:</strong> {despesa.mes_referencia}/{despesa.ano_referencia}
                </Paragraph>

            </div>
        </Container>
    );
}
