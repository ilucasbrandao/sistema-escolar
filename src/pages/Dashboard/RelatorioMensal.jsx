import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../services/api";
import { Container, Title, Paragraph } from "../../components/Container";
import { formatarParaBRL } from "../../utils/format";

export default function RelatorioMensal() {
    const [params] = useSearchParams();
    const mes = params.get("mes");
    const ano = params.get("ano");
    const [dados, setDados] = useState(null);

    useEffect(() => {
        async function carregarRelatorio() {
            try {
                const { data } = await api.get("/relatorio-mensal", {
                    params: { mes, ano },
                });
                setDados(data);
            } catch (error) {
                console.error("Erro ao carregar relatório:", error);
            }
        }
        carregarRelatorio();
    }, [mes, ano]);

    if (!dados) return <Paragraph>Carregando relatório...</Paragraph>;

    return (
        <Container>
            <Title level={1}>
                Relatório de {dayjs(`${ano}-${mes}-01`).format("MMMM [de] YYYY")}
            </Title>

            <section className="mt-4 space-y-2 text-sm text-slate-700">
                <p>
                    <strong>Receitas:</strong> {formatarParaBRL(dados.total_receitas)}
                </p>
                <p>
                    <strong>Despesas:</strong> {formatarParaBRL(dados.total_despesas)}
                </p>
                <p>
                    <strong>Saldo Final:</strong> {formatarParaBRL(dados.saldo)}
                </p>
                <p>
                    <strong>Alunos Ativos:</strong> {dados.alunos_ativos}
                </p>
                <p>
                    <strong>Professores Ativos:</strong> {dados.professores_ativos}
                </p>
            </section>
        </Container>
    );
}
