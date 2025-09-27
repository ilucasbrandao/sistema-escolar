import { useState, useEffect } from "react";
import api from "../../services/api";
import { Container, Title, Paragraph } from "../../components/Container";

export function Dashboard() {
    const [dados, setDados] = useState(null);

    const carregarDashboard = async () => {
        try {
            const { data } = await api.get("/dashboard");
            setDados(data);
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
        }
    };

    useEffect(() => {
        carregarDashboard();
    }, []);

    if (!dados) return <Paragraph>Carregando dashboard...</Paragraph>;

    return (
        <Container>
            <Title level={1}>Dashboard</Title>

            <div className="grid grid-cols-3 gap-6 my-6">
                <div className="p-4 bg-gray-100 rounded shadow text-center">
                    <h3>Alunos Ativos</h3>
                    <p className="font-bold text-xl">{dados.alunos_ativos}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded shadow text-center">
                    <h3>Professores Ativos</h3>
                    <p className="font-bold text-xl">{dados.professores_ativos}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded shadow text-center">
                    <h3>Saldo de Caixa</h3>
                    <p className="font-bold text-xl">{dados.saldo_caixa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
            </div>

            <div className="my-6">
                <h3 className="font-semibold mb-2">Alunos por Turno</h3>
                <ul>
                    {Object.entries(dados.alunos_por_turno).map(([turno, qtd]) => (
                        <li key={turno}>{turno}: {qtd}</li>
                    ))}
                </ul>
            </div>

            <div className="my-6">
                <h3 className="font-semibold mb-2">Aniversariantes do Mês</h3>
                <ul>
                    {dados.aniversariantes.map(a => (
                        <li key={a.nome}>{a.nome} - {new Date(a.data_nascimento).toLocaleDateString()}</li>
                    ))}
                </ul>
            </div>

            <div className="my-6 grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-100 rounded shadow text-center">
                    <h3>Saldo Previsto Mensalidades</h3>
                    <p className="font-bold text-xl">{dados.saldo_previsto_mensalidades.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded shadow text-center">
                    <h3>Saldo Previsto Salários</h3>
                    <p className="font-bold text-xl">{dados.saldo_previsto_salarios.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
            </div>
        </Container>
    );
}
