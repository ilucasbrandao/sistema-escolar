import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { useDespesaForm } from "../../hooks/useDespesaForm";
import { FormCard } from '../../components/FormCard'
import { Field } from "../../components/Field";
import { inputBaseClass } from "../../components/InputBaseClass";

import {
    ChevronLeftIcon,
    Save,
    Banknote,
    Calendar,
    FileText,
    Tag,
    User,
} from "lucide-react";

export default function CadastroDespesa() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const {
        formData,
        professores,
        isLoading,
        handleChange,
        handleSubmit,
        hoje,
        categorias
    } = useDespesaForm(searchParams);

    return (
        <Container>
            <header className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/lancamentos")}
                    className="pl-0 text-slate-500 hover:text-slate-800"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                </Button>
                <Title level={2} className="!mb-0">Nova Despesa</Title>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">

                {/* 1. DADOS FINANCEIROS */}
                <FormCard title="Detalhes do Pagamento" icon={Banknote} iconColor="bg-red-50 text-red-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Valor (R$) *">
                            <input
                                type="number"
                                name="valor"
                                value={formData.valor}
                                onChange={handleChange}
                                className={`${inputBaseClass} text-lg font-bold text-red-600`}
                                placeholder="0.00"
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
                                max={hoje}
                                className={inputBaseClass}
                                required
                            />
                        </Field>

                        <div className="md:col-span-2">
                            <Field label="Categoria da Despesa *">
                                <div className="relative">
                                    <select
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={handleChange}
                                        className={`${inputBaseClass} pl-10 bg-white`}
                                        required
                                    >
                                        <option value="">Selecione a categoria...</option>
                                        {categorias.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                            </Field>
                        </div>
                    </div>
                </FormCard>

                {/* 2. REFERÊNCIA E VÍNCULO */}
                <FormCard title="Referência e Vínculo" icon={Calendar} iconColor="bg-orange-50 text-orange-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Mês">
                                <input
                                    type="number"
                                    name="mes_referencia"
                                    value={formData.mes_referencia}
                                    onChange={handleChange}
                                    className={inputBaseClass}
                                    min="1" max="12"
                                />
                            </Field>
                            <Field label="Ano">
                                <input
                                    type="number"
                                    name="ano_referencia"
                                    value={formData.ano_referencia}
                                    onChange={handleChange}
                                    className={inputBaseClass}
                                />
                            </Field>
                        </div>

                        <Field label="Vincular Professor (Opcional)">
                            <div className="relative">
                                <select
                                    name="id_professor"
                                    value={formData.id_professor}
                                    onChange={handleChange}
                                    className={`${inputBaseClass} pl-10 bg-white`}
                                >
                                    <option value="">Sem vínculo</option>
                                    {professores.map((prof) => (
                                        <option key={prof.id} value={prof.id}>
                                            {prof.nome}
                                        </option>
                                    ))}
                                </select>
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">
                                Selecione se for pagamento de salário.
                            </p>
                        </Field>
                    </div>
                </FormCard>

                {/* 3. DESCRIÇÃO */}
                <FormCard title="Descrição (Gerada Automaticamente)" icon={FileText} iconColor="bg-slate-50 text-slate-500">
                    <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        className={`${inputBaseClass} min-h-[80px]`}
                        placeholder="Detalhes da despesa..."
                    />
                </FormCard>

                {/* BOTÕES */}
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
                        className="bg-red-600 hover:bg-red-700 text-white min-w-[200px] h-12 shadow-lg shadow-red-200 border-none"
                    >
                        {isLoading ? "Salvando..." : (
                            <span className="flex items-center gap-2">
                                <Save className="w-5 h-5" /> Confirmar Despesa
                            </span>
                        )}
                    </Button>
                </footer>
            </form>
        </Container>
    );
}