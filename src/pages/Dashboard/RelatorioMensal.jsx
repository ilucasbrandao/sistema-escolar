import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../services/api";
import { formatarParaBRL } from "../../utils/format";
import { ChevronLeftIcon, Printer, Building2, TrendingUp, AlertCircle, Users } from "lucide-react";
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

    const [observacoes, setObservacoes] = useState("");

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

                const dadosCompletos = {
                    ...data,
                    inadimplencia_total: data.inadimplencia_total,
                    novas_matriculas: data.matriculados_mes_atual,
                    cancelamentos: data.cancelamentos,
                };

                setDados(dadosCompletos);
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

    if (loading) return <div className="flex h-screen items-center justify-center text-slate-500">Gerando relatório...</div>;
    if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

    // Cálculo simples de Ticket Médio (evita divisão por zero)
    const ticketMedio = dados.alunos_status > 0 ? (dados.total_receitas / dados.alunos_status) : 0;

    return (
        <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:p-0 font-sans">

            {/* Estilos globais de impressão para forçar cores */}
            <style>{`
                @media print {
                    @page { margin: 10mm; size: A4; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>

            {/* Barra de Controle (Não sai na impressão) */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden px-4 sm:px-0">
                <Button onClick={() => navigate(-1)} variant="secondary" className="flex items-center gap-2">
                    <ChevronLeftIcon className="w-4 h-4" /> Voltar
                </Button>
                <div className="text-sm text-slate-500 hidden sm:block">
                    Dica: Digite suas observações abaixo antes de imprimir.
                </div>
                <Button onClick={() => window.print()} className="bg-blue-600 text-white flex items-center gap-2 shadow-md hover:bg-blue-700">
                    <Printer className="w-4 h-4" /> Imprimir Relatório
                </Button>
            </div>

            {/* FOLHA A4 - Layout Fixo */}
            <div className="max-w-[210mm] mx-auto bg-white p-[15mm] shadow-xl rounded-sm min-h-[297mm] print:shadow-none print:w-full print:max-w-none print:min-h-0 print:border-none">

                {/* Cabeçalho Institucional */}
                <header className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide mb-1 leading-none">{EMPRESA.nome}</h1>
                        <div className="text-xs text-slate-500 space-y-1 mt-2">
                            <p className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {EMPRESA.endereco}</p>
                            <p>CNPJ: {EMPRESA.cnpj} | Resp: {EMPRESA.responsavel}</p>
                            <p>Contato: {EMPRESA.telefone}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="bg-slate-100 p-3 rounded-lg inline-block border border-slate-200 print:bg-slate-100 print:border-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Referência</p>
                            <p className="text-lg font-bold text-slate-800 capitalize leading-tight">
                                {dayjs(`${ano}-${mes}-01`).format("MMMM YYYY")}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Título */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-slate-800 inline-block px-4 py-1 border-b-2 border-orange-200">
                        Relatório Gerencial e Financeiro
                    </h2>
                </div>

                {/* 1. Resumo Financeiro */}
                <section className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-slate-300"></span> Fluxo de Caixa <span className="flex-1 h-[1px] bg-slate-200"></span>
                    </h3>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-lg border border-slate-100 bg-green-50 print:bg-green-50">
                            <p className="text-[10px] text-green-700 font-bold uppercase mb-1">Entradas (Receitas)</p>
                            <p className="text-xl font-bold text-slate-800">{formatarParaBRL(dados.total_receitas)}</p>
                        </div>
                        <div className="p-4 rounded-lg border border-slate-100 bg-red-50 print:bg-red-50">
                            <p className="text-[10px] text-red-700 font-bold uppercase mb-1">Saídas (Despesas)</p>
                            <p className="text-xl font-bold text-slate-800">{formatarParaBRL(dados.total_despesas)}</p>
                        </div>
                        <div className={`p-4 rounded-lg border print:border-slate-300 ${dados.saldo >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Saldo Líquido</p>
                            <p className={`text-xl font-bold ${dados.saldo >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                {formatarParaBRL(dados.saldo)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Indicadores de Desempenho (Novidade!) */}
                <section className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-slate-300"></span> Indicadores de Saúde <span className="flex-1 h-[1px] bg-slate-200"></span>
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Tabela Operacional */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase border-b border-slate-200">
                                    <tr>
                                        <th className="px-3 py-2">Métrica</th>
                                        <th className="px-3 py-2 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    <tr>
                                        <td className="px-3 py-2 flex items-center gap-2"><Users className="w-3 h-3 text-slate-400" /> Total de Alunos</td>
                                        <td className="px-3 py-2 text-right font-bold">{dados.alunos_status}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 flex items-center gap-2"><TrendingUp className="w-3 h-3 text-green-500" /> Novas Matrículas</td>
                                        <td className="px-3 py-2 text-right font-bold text-green-600">+{dados.novas_matriculas}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 flex items-center gap-2"><Users className="w-3 h-3 text-slate-400" /> Professores</td>
                                        <td className="px-3 py-2 text-right">{dados.professores_status}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Tabela Financeira Analítica */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase border-b border-slate-200">
                                    <tr>
                                        <th className="px-3 py-2">Métrica Financeira</th>
                                        <th className="px-3 py-2 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    <tr>
                                        <td className="px-3 py-2 flex items-center gap-2"><AlertCircle className="w-3 h-3 text-red-400" /> Inadimplência Total</td>
                                        <td className="px-3 py-2 text-right font-bold text-red-600">{formatarParaBRL(dados.inadimplencia_total)}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">Ticket Médio (aprox.)</td>
                                        <td className="px-3 py-2 text-right text-slate-500">{formatarParaBRL(ticketMedio)}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 text-xs text-slate-400 italic" colSpan={2}>
                                            * Inadimplência não afeta o saldo de caixa atual.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 3. Campo de Observações (Editável) */}
                <section className="mb-12">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-slate-300"></span> Observações e Justificativas <span className="flex-1 h-[1px] bg-slate-200"></span>
                    </h3>

                    {/* Textarea que vira div na impressão para ficar bonito */}
                    <div className="relative">
                        <textarea
                            className="w-full p-4 border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none min-h-[100px] print:hidden resize-none"
                            placeholder="Digite aqui observações relevantes para este mês (ex: compra de material extra, feriados, etc)..."
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                        />
                        {/* Versão para Impressão (Só aparece ao imprimir) */}
                        <div className="hidden print:block w-full p-4 border border-slate-200 rounded-lg text-sm text-slate-800 min-h-[100px] bg-slate-50 text-justify leading-relaxed whitespace-pre-wrap">
                            {observacoes || "Nenhuma observação registrada para este período."}
                        </div>
                    </div>
                </section>

                {/* Rodapé e Assinatura */}
                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-10 items-end">
                        <div className="text-xs text-slate-400">
                            <p>Relatório gerado em: <strong>{dayjs().format("DD/MM/YYYY [às] HH:mm")}</strong></p>
                            <p>Sistema: Espaço Ao Pé da Letra v1.0</p>
                        </div>
                        <div className="text-center">
                            <div className="border-b border-slate-800 mb-2 w-full"></div>
                            <p className="text-xs font-bold text-slate-700 uppercase">{EMPRESA.responsavel}</p>
                            <p className="text-[10px] text-slate-400">Administração</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}