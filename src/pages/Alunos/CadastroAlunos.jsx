import { useNavigate } from "react-router-dom";
import { useCadastroAluno } from "../../hooks/useCadastroAluno";

// Componentes Reutilizáveis
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { FormCard } from "../../components/FormCard";
import { inputBaseClass } from "../../components/InputBaseClass";

// Ícones
import { ChevronLeftIcon, Save } from "lucide-react";

// Sub-seções que criamos
import { SectionAluno } from "./components/FormSections/SectionAluno";
import { SectionResponsavel } from "./components/FormSections/SectionResponsavel";
import { SectionFinanceiro } from "./components/FormSections/SectionFinanceiro";

export default function CadastroAlunos() {
    const navigate = useNavigate();
    const { formData, handleChange, handleSubmit, isLoading, hoje } = useCadastroAluno();

    return (
        <Container>
            {/* Header Enxuto */}
            <header className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/alunos")}
                    className="flex items-center text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                </button>
                <Title level={2} className="!mb-0 text-slate-800">Nova Matrícula</Title>
                <div className="w-20"></div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">

                {/* Seções Componentizadas */}
                <SectionAluno formData={formData} handleChange={handleChange} hoje={hoje} />

                <SectionResponsavel formData={formData} handleChange={handleChange} />

                <SectionFinanceiro formData={formData} handleChange={handleChange} />

                {/* Último bloco de Observações (mantido aqui por ser simples) */}
                <FormCard title="Observações Finais" icon={Save} iconColor="bg-slate-50 text-slate-500">
                    <textarea
                        name="observacao"
                        value={formData.observacao}
                        onChange={handleChange}
                        className={`${inputBaseClass} min-h-[100px]`}
                        placeholder="Alergias, restrições ou recados importantes..."
                    />
                </FormCard>

                {/* Footer de Ações */}
                <footer className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/alunos")}
                        className="text-slate-500 hover:bg-slate-100"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[220px] h-12 shadow-lg shadow-blue-200"
                    >
                        {isLoading ? "Processando..." : (
                            <span className="flex items-center gap-2">
                                <Save className="w-5 h-5" /> Finalizar Matrícula
                            </span>
                        )}
                    </Button>
                </footer>
            </form>
        </Container>
    );
}