import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paragraph, Title } from "../../components/Container";
import { Trash, ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import dayjs from "dayjs";
import { Button } from "../../components/Button";

function formatarDataLegivel(dataISO) {
    if (!dataISO || !dayjs(dataISO).isValid()) return "—";
    return dayjs(dataISO).format("DD/MM/YYYY");
}

export default function VisualizarReceita() {
    const navigate = useNavigate();
    const { alunoId, receitaId } = useParams();
    const [receita, setReceita] = useState(null);

    useEffect(() => {
        async function carregarMensalidade() {
            try {
                const response = await api.get(
                    `/receitas/aluno/${alunoId}/${receitaId}`
                );
                setReceita(response.data);
            } catch (error) {
                console.error("Erro ao buscar mensalidade:", error);
            }
        }
        carregarMensalidade();
    }, [alunoId, receitaId]);

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
            await api.delete(`/receitas/${receitaId}`);
            alert("Mensalidade excluída com sucesso!");
            navigate(`/alunos/${alunoId}`);
        } catch (error) {
            console.error("Erro ao excluir mensalidade:", error);
            alert("Erro ao excluir mensalidade.");
        }
    }

    if (!receita) {
        return (
            <Container className="flex justify-center items-center h-full">
                <Paragraph muted>Carregando mensalidade...</Paragraph>
            </Container>
        );
    }

    return (
        <Container>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <Button
                    onClick={() => navigate(`/alunos/${alunoId}`)}
                    variant="neutral"
                >
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </Button>
                <Title level={2}>Mensalidade</Title>
                <Button
                    onClick={handleDelete}
                    variant="danger"
                    title="Excluir Mensalidade"
                >
                    <Trash className="w-5 h-5" />
                </Button>
            </div>

            {/* Card de dados */}
            <div className="bg-white rounded-md shadow-sm p-4 space-y-2 text-sm text-slate-700">
                <Paragraph>
                    <strong>Valor:</strong> Number(receita.valor).toFixed(2).replace('.', ',')
                </Paragraph>
                <Paragraph>
                    <strong>Data de Pagamento:</strong>{" "}
                    {formatarDataLegivel(receita.data_pagamento)}
                </Paragraph>
                <Paragraph>
                    <strong>Mês Referente:</strong> {receita.mes_referencia}/
                    {receita.ano_referencia}
                </Paragraph>
            </div>
        </Container>
    );
}
