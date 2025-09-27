import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paragraph } from "../../components/Container";
import { Trash, ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import dayjs from "dayjs";

// Função para formatar data ISO → DD/MM/YYYY
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
                const response = await api.get(`/receitas/aluno/${alunoId}/${receitaId}`);
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

        const confirm = window.confirm("Tem certeza que deseja excluir esta mensalidade?");
        if (!confirm) return;

        try {
            await api.delete(`/receitas/${receitaId}`);
            alert("Mensalidade excluída com sucesso!");
            navigate(`/alunos/${alunoId}`); // volta para histórico do aluno
        } catch (error) {
            console.error("Erro ao excluir mensalidade:", error);
            alert("Erro ao excluir mensalidade.");
        }
    }

    if (!receita) {
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
                    onClick={() => navigate(`/alunos/${alunoId}`)}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                >
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </button>
            </div>

            {/* Dados da mensalidade */}
            <Container className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                <div className="flex flex-col gap-1">
                    <Paragraph>
                        <strong>Valor: </strong> R$ {receita.valor}
                    </Paragraph>
                    <Paragraph>
                        <strong>Data de Pagamento: </strong> {formatarDataLegivel(receita.data_pagamento)}
                    </Paragraph>
                    <Paragraph>
                        <strong>Mês Referente: </strong> {receita.mes_referencia}/{receita.ano_referencia}
                    </Paragraph>
                    <Paragraph>
                        <strong>Status: </strong> {receita.status}
                    </Paragraph >
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
