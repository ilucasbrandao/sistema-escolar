import { Users } from "lucide-react";
import { FormCard } from "../../../../components/FormCard";
import { Field } from "../../../../components/Field";
import { inputBaseClass } from "../../../../components/InputBaseClass";

export function SectionResponsavel({ formData, handleChange }) {
    return (
        <FormCard title="Responsável" icon={Users} iconColor="bg-purple-50 text-purple-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <Field label="Nome do Responsável *">
                        <input
                            name="responsavel"
                            value={formData.responsavel}
                            onChange={handleChange}
                            className={inputBaseClass}
                            placeholder="Pai, Mãe ou Responsável Legal"
                            required
                        />
                    </Field>
                </div>

                <Field label="WhatsApp / Telefone">
                    <input
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className={inputBaseClass}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                    />
                </Field>

                <Field label={`Email ${formData.plano === 'premium' ? '(Obrigatório para App)' : '(Opcional)'}`}>
                    <input
                        type="email"
                        name="email_responsavel"
                        value={formData.email_responsavel}
                        onChange={handleChange}
                        className={`${inputBaseClass} ${formData.plano === 'premium' ? 'border-amber-300 bg-amber-50 focus:ring-amber-400' : ''}`}
                        placeholder="email@exemplo.com"
                    />
                </Field>
            </div>
        </FormCard>
    );
}