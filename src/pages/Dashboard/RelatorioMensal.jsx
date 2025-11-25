import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../services/api";
import { formatarParaBRL } from "../../utils/format";
import { ChevronLeftIcon, Printer, Building2, CalendarDays } from "lucide-react";
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

    if (loading) return <div className="flex h-screen items-center justify-center text-slate-500">Gerando relatório...</div>;
    if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:p-0">

            {/* Barra de Controle (Não sai na impressão) */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden px-4 sm:px-0">
                <Button onClick={() => navigate(-1)} variant="secondary" className="flex items-center gap-2">
                    <ChevronLeftIcon className="w-4 h-4" /> Voltar
                </Button>
                <Button onClick={() => window.print()} className="bg-blue-600 text-white flex items-center gap-2 shadow-md hover:bg-blue-700">
                    <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
                </Button>
            </div>

            {/* FOLHA A4 */}
            <div className="max-w-[210mm] mx-auto bg-white p-[15mm] shadow-xl rounded-sm min-h-[297mm] print:shadow-none print:w-full print:max-w-none print:min-h-0">

                {/* Cabeçalho Institucional */}
                <header className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide mb-1">{EMPRESA.nome}</h1>
                        <div className="text-xs text-slate-500 space-y-0.5">
                            <p className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {EMPRESA.endereco}</p>
                            <p>CNPJ: {EMPRESA.cnpj}</p>
                            <p>Resp: {EMPRESA.responsavel}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="bg-slate-100 p-3 rounded-lg inline-block">
                            <p className="text-xs font-bold text-slate-400 uppercase">Referência</p>
                            <p className="text-lg font-bold text-slate-800 capitalize">
                                {dayjs(`${ano}-${mes}-01`).format("MMMM YYYY")}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Título do Documento */}
                <div className="text-center mb-10">
                    <h2 className="text-xl font-serif font-bold text-slate-800 border-b border-slate-200 inline-block pb-2 px-8">
                        Relatório de Fechamento Mensal
                    </h2>
                </div>

                {/* Resumo Financeiro (Cards) */}
                <section className="mb-10">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                        <span className="w-full h-[1px] bg-slate-200"></span> Financeiro <span className="w-full h-[1px] bg-slate-200"></span>
                    </h3>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100 print:border-gray-300 print:bg-transparent">
                            <p className="text-xs text-green-700 font-bold uppercase mb-1">Total Receitas</p>
                            <p className="text-xl font-bold text-slate-800">{formatarParaBRL(dados.total_receitas)}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100 print:border-gray-300 print:bg-transparent">
                            <p className="text-xs text-red-700 font-bold uppercase mb-1">Total Despesas</p>
                            <p className="text-xl font-bold text-slate-800">{formatarParaBRL(dados.total_despesas)}</p>
                        </div>
                        <div className={`p-4 rounded-lg border print:border-gray-300 print:bg-transparent ${dados.saldo >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Saldo Final</p>
                            <p className={`text-xl font-bold ${dados.saldo >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                {formatarParaBRL(dados.saldo)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Dados Operacionais */}
                <section className="mb-12">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                        <span className="w-full h-[1px] bg-slate-200"></span> Operacional <span className="w-full h-[1px] bg-slate-200"></span>
                    </h3>

                    <div className="overflow-hidden border border-slate-200 rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 w-1/2">Indicador</th>
                                    <th className="px-4 py-3 w-1/2 text-right">Quantidade no Período</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="px-4 py-3 text-slate-700">Alunos Ativos</td>
                                    <td className="px-4 py-3 text-right font-bold">{dados.alunos_status}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-slate-700">Professores Ativos</td>
                                    <td className="px-4 py-3 text-right font-bold">{dados.professores_status}</td>
                                </tr>
                                {/* Você pode adicionar mais linhas aqui se o backend mandar (ex: novos matriculados) */}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Rodapé do Documento */}
                <div className="mt-auto pt-12">
                    <div className="flex justify-between items-end text-xs text-slate-400">
                        <div>
                            <p>Gerado em: {dayjs().format("DD/MM/YYYY [às] HH:mm")}</p>
                            <p>Sistema de Gestão Escolar v2.0</p>
                        </div>
                        <div className="text-center w-48">
                            <div className="border-b border-slate-300 mb-2"></div>
                            <p>Assinatura do Responsável</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}