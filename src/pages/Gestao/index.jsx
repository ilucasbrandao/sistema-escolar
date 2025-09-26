import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, Paragraph, Title } from "../../components/Container";
import { ChevronLeftIcon, UserRoundPlus } from "lucide-react";
import { formatarParaBRL, formatarParaData } from "../../utils/format";

export function Lancamentos() {
    const navigate = useNavigate();
    const [lancamentos, setLancamentos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Carregar lançamentos do backend
    useEffect(() => {
        async function carregar() {
            setLoading(true);
            try {
                const { data } = await api.get("/lancamentos");
                console.log("Lançamentos recebidos:", data);
                setLancamentos(data);
            } catch (error) {
                console.error("Erro ao carregar lançamentos:", error);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, []);

    // Filtrar lançamentos pela descrição
    const filteredLancamentos = lancamentos.filter((l) =>
        l.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            {/* Botões nos extremos */}
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" />
                </Button>
                <Button onClick={() => navigate("/lancamentos/cadastrar")}>
                    <UserRoundPlus className="w-5 h-5" />
                </Button>
            </div>

            <div className="text-center">
                <Title level={1}>Histórico de Lançamentos</Title>
                <Paragraph muted className="mt-4">
                    Informações sobre os lançamentos serão exibidas aqui:
                </Paragraph>

                {/* Pesquisa */}
                <div className="mt-6 mb-4 flex justify-end">
                    <input
                        type="text"
                        placeholder="Pesquisar por descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md w-72 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    />
                </div>

                {/* Tabela de lançamentos */}
                {loading ? (
                    <Paragraph muted>Carregando lançamentos...</Paragraph>
                ) : filteredLancamentos.length === 0 ? (
                    <Paragraph muted>Nenhum lançamento encontrado.</Paragraph>
                ) : (
                    <table className="w-full border-collapse border mb-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-2 py-1">Tipo</th>
                                <th className="border px-2 py-1">Descrição</th>
                                <th className="border px-2 py-1">Valor</th>
                                <th className="border px-2 py-1">Data</th>
                                <th className="border px-2 py-1">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLancamentos.map((l) => (
                                <tr
                                    key={l.id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => navigate(`/lancamentos/${l.id}`)}
                                >
                                    <td className="border px-2 py-1">{l.tipo}</td>
                                    <td className="border px-2 py-1">{l.descricao}</td>
                                    <td className="border px-2 py-1">{formatarParaBRL(l.valor)}</td>
                                    <td className="border px-2 py-1">
                                        {l.data_pagamento
                                            ? formatarParaData(l.data_pagamento)
                                            : l.data_vencimento
                                                ? formatarParaData(l.data_vencimento)
                                                : "-"}
                                    </td>
                                    <td className="border px-2 py-1">{l.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Container>
    );
}
