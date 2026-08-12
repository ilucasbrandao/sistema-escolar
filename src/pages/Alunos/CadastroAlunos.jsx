import { useNavigate } from "react-router-dom";
import { useCadastroAluno } from "../../hooks/useCadastroAluno";

// Componentes Reutilizáveis
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { FormCard } from "../../components/FormCard";
import { inputBaseClass } from "../../components/InputBaseClass";

// Ícones
import {
    ChevronLeftIcon,
    Save,
    User,
    Users,
    CreditCard,
    FileText,
    Sparkles,
    Loader2
} from "lucide-react";

// Sub-seções
import { SectionAluno } from "./components/FormSections/SectionAluno";
import { SectionResponsavel } from "./components/FormSections/SectionResponsavel";
import { SectionFinanceiro } from "./components/FormSections/SectionFinanceiro";

export default function CadastroAlunos() {
    const navigate = useNavigate();
    const { formData, handleChange, handleSubmit, isLoading, hoje } = useCadastroAluno();

    return (
        <Container className="pb-24">
            {/* Header com Navegação Limpa */}
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/alunos")}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Button>
                    <div>
                        <Title level={2} className="!mb-0 text-2xl font-bold text-slate-800">
                            Nova Matrícula
                        </Title>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Preencha as informações necessárias para registrar o estudante
                        </p>
                    </div>
                </div>

                {/* Badge do Plano Selecionado */}
                <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700 capitalize">
                        Plano: {formData.plano || "Padrão"}
                    </span>
                </div>
            </header>

            {/* Atalhos Rápidos/Ancoragem de Seções */}
            <div className="max-w-4xl mx-auto mb-6 hidden md:grid grid-cols-4 gap-3 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><User className="w-4 h-4" /></div>
                    <span>1. Dados do Aluno</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Users className="w-4 h-4" /></div>
                    <span>2. Responsável</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><CreditCard className="w-4 h-4" /></div>
                    <span>3. Financeiro</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                    <span>4. Observações</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
                {/* Seções Componentizadas */}
                <SectionAluno formData={formData} handleChange={handleChange} hoje={hoje} />

                <SectionResponsavel formData={formData} handleChange={handleChange} />

                <SectionFinanceiro formData={formData} handleChange={handleChange} />

                {/* Observações Finais */}
                <FormCard title="Observações Pedagógicas & Restrições" icon={FileText} iconColor="bg-slate-100 text-slate-600">
                    <textarea
                        name="observacao"
                        value={formData.observacao}
                        onChange={handleChange}
                        rows={3}
                        className={`${inputBaseClass} resize-y min-h-[90px]`}
                        placeholder="Alergias, restrições alimentares, dificuldades de aprendizagem ou observações gerais..."
                    />
                </FormCard>

                {/* Footer Flutuante/Sticky para facilidade de envio */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40 shadow-lg">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/alunos")}
                            className="hidden sm:inline-flex text-slate-600 hover:bg-slate-300"
                        >
                            Descartar e Voltar
                        </Button>

                        <div className="flex items-center gap-3">


                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-blue-200 transition flex items-center gap-2 min-w-[200px] justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Finalizar Matrícula</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Container>
    );
}