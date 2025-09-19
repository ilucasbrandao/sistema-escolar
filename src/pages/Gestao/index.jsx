import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, TitleH1, Paragrafos } from "../../components/Container";
import { ChevronLeftIcon } from "lucide-react";
import { formatarParaBRL, formatarParaData } from "../../utils/format";

export function Lancamentos() {
    const navigate = useNavigate();

    const [lancamentos, setLancamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    // Carregar lançamentos do backend
    useEffect(() => {
        async function carregarLancamentos() {
            setLoading(true);
            try {
                const params = {};
                if (dataInicial) params.data_inicial = dataInicial;
                if (dataFinal) params.data_final = dataFinal;

                const { data } = await api.get("/lancamentos", { params });
                setLancamentos(data);
            } catch (error) {
                console.error("Erro ao carregar lançamentos:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarLancamentos();
    }, [dataInicial, dataFinal]);

    // Paginação
    const totalPaginas = Math.ceil(lancamentos.length / itensPorPagina);
    const lancamentosPagina = lancamentos.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    return (
        <Container>
            {/* Botão voltar */}
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" />
                </Button>
            </div>

            <TitleH1>Lançamentos Financeiros</TitleH1>
            <Paragrafos className="mt-2 mb-6">
                Escolha se deseja registrar uma entrada ou saída ou consulte o histórico.
            </Paragrafos>

            {/* Botões de entrada e saída */}
            <div className="flex justify-center gap-6 mb-8">
                <Button
                    onClick={() =>
                        navigate("/gestao-financeira/cadastrar", { state: { tipo: "entrada" } })
                    }
                    className="px-8 py-6 text-xl font-semibold bg-green-500 hover:bg-green-600 rounded-lg shadow-md"
                >
                    Entrada
                </Button>

                <Button
                    onClick={() =>
                        navigate("/gestao-financeira/cadastrar", { state: { tipo: "saida" } })
                    }
                    className="px-8 py-6 text-xl font-semibold bg-red-500 hover:bg-red-600 rounded-lg shadow-md"
                >
                    Saída
                </Button>
            </div>

            {/* Filtro por data */}
            <div className="flex gap-4 mb-4 justify-center">
                <div>
                    <label>Data Inicial:</label>
                    <input
                        type="date"
                        value={dataInicial}
                        onChange={(e) => setDataInicial(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>
                <div>
                    <label>Data Final:</label>
                    <input
                        type="date"
                        value={dataFinal}
                        onChange={(e) => setDataFinal(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>
            </div>

            {/* Tabela de histórico */}
            {loading ? (
                <p>Carregando lançamentos...</p>
            ) : lancamentos.length === 0 ? (
                <p>Nenhum lançamento encontrado.</p>
            ) : (
                <table className="w-full border-collapse border mb-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1">Tipo</th>
                            <th className="border px-2 py-1">Categoria</th>
                            <th className="border px-2 py-1">Descrição</th>
                            <th className="border px-2 py-1">Valor</th>
                            <th className="border px-2 py-1">Data Vencimento</th>
                            <th className="border px-2 py-1">Data Pagamento</th>
                            <th className="border px-2 py-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lancamentosPagina.map((l) => (
                            <tr key={l.id}>
                                <td className="border px-2 py-1">{l.tipo}</td>
                                <td className="border px-2 py-1">{l.categoria}</td>
                                <td className="border px-2 py-1">{l.descricao}</td>
                                <td className="border px-2 py-1">{formatarParaBRL(l.valor)}</td>
                                <td className="border px-2 py-1">
                                    {l.data_vencimento ? formatarParaData(l.data_vencimento) : "-"}
                                </td>
                                <td className="border px-2 py-1">
                                    {l.data_pagamento ? formatarParaData(l.data_pagamento) : "-"}
                                </td>
                                <td className="border px-2 py-1">{l.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Paginação */}
            <div className="flex justify-center gap-2">
                <Button
                    onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                    disabled={paginaAtual === 1}
                >
                    Anterior
                </Button>
                <span className="px-2 py-1">{`${paginaAtual} / ${totalPaginas}`}</span>
                <Button
                    onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
                    disabled={paginaAtual === totalPaginas}
                >
                    Próxima
                </Button>
            </div>
        </Container>
    );
}
