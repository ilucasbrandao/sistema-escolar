import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, TitleH1, Paragrafos } from "../../components/Container";
import { formatarParaBRL, formatarParaData } from "../../utils/format";

export function LancamentoDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lancamento, setLancamento] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function buscarLancamento() {
            try {
                const { data } = await api.get(`/gestao-financeira/${id}`);
                setLancamento(data);
            } catch (error) {
                console.error("Erro ao buscar lançamento:", error);
            } finally {
                setLoading(false);
            }
        }
        buscarLancamento();
    }, [id]);

    async function excluirLancamento() {
        if (confirm("Tem certeza que deseja excluir este lançamento?")) {
            try {
                await api.delete(`/gestao-financeira/${id}`);
                navigate("/gestao-financeira");
            } catch (error) {
                console.error("Erro ao excluir:", error);
            }
        }
    }

    if (loading) return <p>Carregando...</p>;
    if (!lancamento) return <p>Lançamento não encontrado.</p>;

    return (
        <Container>
            <Button onClick={() => navigate("/gestao-financeira")}>Voltar</Button>
            <TitleH1>Detalhes do Lançamento</TitleH1>

            <div className="mt-4 space-y-2">
                <Paragrafos><strong>Tipo:</strong> {lancamento.tipo}</Paragrafos>
                <Paragrafos><strong>Categoria:</strong> {lancamento.categoria}</Paragrafos>
                <Paragrafos><strong>Descrição:</strong> {lancamento.descricao}</Paragrafos>
                <Paragrafos><strong>Valor:</strong> {formatarParaBRL(lancamento.valor)}</Paragrafos>
                <Paragrafos><strong>Data Vencimento:</strong> {formatarParaData(lancamento.data_vencimento)}</Paragrafos>
                <Paragrafos><strong>Data Pagamento:</strong> {formatarParaData(lancamento.data_pagamento)}</Paragrafos>
                <Paragrafos><strong>Status:</strong> {lancamento.status}</Paragrafos>
                {lancamento.observacoes && (
                    <Paragrafos><strong>Observações:</strong> {lancamento.observacoes}</Paragrafos>
                )}
            </div>

            <div className="flex gap-4 mt-6">
                <Button onClick={() => navigate(`/gestao-financeira/editar/${id}`)} className="bg-blue-500 hover:bg-blue-600">
                    Editar
                </Button>
                <Button onClick={excluirLancamento} className="bg-red-500 hover:bg-red-600">
                    Excluir
                </Button>
            </div>
        </Container>
    );
}
