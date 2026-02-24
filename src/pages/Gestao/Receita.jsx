import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Field } from "../../components/Field";
import { FormCard } from "../../components/FormCard";
import { inputBaseClass } from "../../components/InputBaseClass";
import { Button } from "../../components/Button";
import { useReceitaForm } from "../../hooks/useReceitaForm";
import {
    ChevronLeftIcon,
    Wallet,
    FileText,
    User,
    DollarSign,
} from "lucide-react";

export default function CadastroReceita() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { formData, alunos, isLoading, handleChange, handleSubmit, hojeISO } =
        useReceitaForm(searchParams);

    return (
        <Container>
            <header className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/lancamentos")}
                    className="pl-0 text-slate-500"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                </Button>
                <Title level={2} className="!mb-0">
                    Nova Receita
                </Title>
            </header>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-4xl mx-auto pb-10"
            >
                <FormCard
                    title="Aluno Pagante"
                    icon={User}
                    iconColor="bg-blue-50 text-blue-600"
                >
                    <Field label="Selecione o Aluno *">
                        <div className="relative">
                            <select
                                name="id_aluno"
                                value={formData.id_aluno}
                                onChange={handleChange}
                                className={`${inputBaseClass} pl-10 bg-white`}
                                required
                            >
                                <option value="">Selecione um aluno ativo...</option>
                                {alunos.map((aluno) => (
                                    <option key={aluno.id} value={aluno.id}>
                                        {aluno.nome}
                                    </option>
                                ))}
                            </select>
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        </div>
                    </Field>
                </FormCard>

                <FormCard
                    title="Dados do Pagamento"
                    icon={DollarSign}
                    iconColor="bg-green-50 text-green-600"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Valor Recebido (R$) *">
                            <input
                                type="number"
                                name="valor"
                                value={formData.valor}
                                onChange={handleChange}
                                className={`${inputBaseClass} text-lg font-bold text-green-600`}
                                step="0.01"
                                required
                            />
                        </Field>

                        <Field label="Data do Pagamento *">
                            <input
                                type="date"
                                name="data_pagamento"
                                value={formData.data_pagamento}
                                onChange={handleChange}
                                max={hojeISO}
                                className={inputBaseClass}
                                required
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <Field label="Mês Referência">
                                <input
                                    type="number"
                                    name="mes_referencia"
                                    value={formData.mes_referencia}
                                    onChange={handleChange}
                                    className={inputBaseClass}
                                    min="1"
                                    max="12"
                                />
                            </Field>
                            <Field label="Ano Referência">
                                <input
                                    type="number"
                                    name="ano_referencia"
                                    value={formData.ano_referencia}
                                    onChange={handleChange}
                                    className={inputBaseClass}
                                />
                            </Field>
                        </div>
                    </div>
                </FormCard>

                <FormCard
                    title="Descrição (Automática)"
                    icon={FileText}
                    iconColor="bg-slate-50 text-slate-500"
                >
                    <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        className={`${inputBaseClass} min-h-[80px]`}
                    />
                </FormCard>

                <footer className="flex items-center justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/lancamentos")}
                        className="text-slate-500"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[200px] h-12 shadow-lg"
                    >
                        {isLoading ? (
                            "Salvando..."
                        ) : (
                            <span className="flex items-center gap-2">
                                <Wallet className="w-5 h-5" /> Confirmar Recebimento
                            </span>
                        )}
                    </Button>
                </footer>
            </form>
        </Container>
    );
}