import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../services/api";
import { Container, Title, Paragraph } from "../../components/Container";
import { formatarParaBRL } from "../../utils/format";
import { ChevronLeftIcon, PrinterIcon } from "lucide-react";
import { Button } from "../../components/Button";

const EMPRESA = {
    nome: "Espaço ao Pé da Letra",
    endereco: "Rua Major Antonio Rodrigues Teixeira, 808 - Bairro Cruzeiro - Itapipoca/CE",
    cnpj: "xx.xxx.xxx/xxxx-xx",
    responsavel: "Julianne Kelly da S. L. Brandão",
    telefone: "(88)9 9637-9636",
    email: "contato@escolaexemplo.com.br"
};

export default function RelatorioMensal() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const mes = params.get("mes");
    const ano = params.get("ano");
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!mes || !ano) {
            setError("Mês ou ano inválido.");
            setLoading(false);
            return;
        }

        async function carregarRelatorio() {
            try {
                setLoading(true);
                const { data } = await api.get("/relatorio-mensal", {
                    params: { mes, ano },
                });
                setDados(data);
                setError("");
            } catch (err) {
                console.error("Erro ao carregar relatório:", err);
                setError("Erro ao carregar relatório. Tente novamente.");
            } finally {
                setLoading(false);
            }
        }
        carregarRelatorio();
    }, [mes, ano]);

    if (loading) return <Paragraph>Carregando relatório...</Paragraph>;
    if (error) return <Paragraph className="text-red-600">{error}</Paragraph>;

    return (
        <Container className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow print:shadow-none print:p-0">
            <Button onClick={() => navigate("/")}>
                <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            {/* Cabeçalho institucional */}
            <header className="border-b pb-4 mb-6 text-sm text-gray-700">
                <h1 className="text-2xl font-bold text-gray-900">{EMPRESA.nome}</h1>
                <p>{EMPRESA.endereco}</p>
                <p>CNPJ: {EMPRESA.cnpj}</p>
                <p>Responsável: {EMPRESA.responsavel}</p>
                <p>Contato: {EMPRESA.telefone} · {EMPRESA.email}</p>
            </header>

            {/* Título do relatório */}
            <Title level={2} className="text-center text-gray-800 mb-6">
                Relatório Financeiro — {dayjs(`${ano}-${mes}-01`).format("MMMM [de] YYYY")}
            </Title>

            {/* Tabela de dados */}
            <section className="border rounded-md divide-y divide-gray-200 text-sm text-gray-700 overflow-hidden">
                <div className="flex justify-between px-4 py-3 bg-gray-50 font-medium">
                    <span>Total de Receitas</span>
                    <span className="text-green-700">{formatarParaBRL(dados.total_receitas)}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                    <span>Total de Despesas</span>
                    <span className="text-red-700">{formatarParaBRL(dados.total_despesas)}</span>
                </div>
                <div className="flex justify-between px-4 py-3 bg-gray-50 font-semibold">
                    <span>Saldo Final</span>
                    <span className="text-gray-900">{formatarParaBRL(dados.saldo)}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                    <span>Alunos Ativos</span>
                    <span>{dados.alunos_status}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                    <span>Professores Ativos</span>
                    <span>{dados.professores_status}</span>
                </div>
            </section>

            {/* Botão de impressão */}
            <div className="mt-8 flex justify-center print:hidden">
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    <PrinterIcon className="w-5 h-5" />
                    Imprimir Relatório
                </button>
            </div>
        </Container>

    );
}
