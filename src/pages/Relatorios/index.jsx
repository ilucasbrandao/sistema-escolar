import { FileSpreadsheet, Download, Users } from "lucide-react";
import { Container, Title } from "../../components/Container";
import { FormCard } from "../../components/FormCard";
import { Button } from "../../components/Button";
import { useRelatorios } from "../../hooks/useRelatorio.js";

export default function Relatorios() {
    const { exportarAlunosAtivos } = useRelatorios();

    return (
        <Container>
            <header className="mb-8">
                <Title level={1}>Relatórios e Exportações</Title>
                <p className="text-slate-500 text-sm">Extraia dados do sistema para Excel ou Impressão.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Card: Relação de Alunos Ativos */}
                <FormCard
                    title="Relação de Alunos Ativos"
                    icon={Users}
                    iconColor="bg-blue-50 text-blue-600"
                >
                    <div className="space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Gera uma planilha Excel com a lista completa de alunos matriculados,
                            incluindo série, turno e contato do responsável.
                        </p>

                        <Button
                            onClick={exportarAlunosAtivos}
                            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                        >
                            <FileSpreadsheet size={18} />
                            Exportar para Excel
                        </Button>
                    </div>
                </FormCard>

                {/* Futuro Relatório: Financeiro (Placeholder) */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-60">
                    <div className="bg-slate-100 p-3 rounded-full mb-3">
                        <Download className="text-slate-400" />
                    </div>
                    <span className="font-bold text-slate-400 text-sm uppercase">Em breve</span>
                    <p className="text-xs text-slate-400 mt-1">Relatórios Financeiros e Mensalidades.</p>
                </div>

            </div>
        </Container>
    );
}
