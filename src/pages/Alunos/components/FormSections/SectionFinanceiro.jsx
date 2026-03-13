import { Wallet, Crown } from "lucide-react";
import { FormCard } from "../../../../components/FormCard";
import { Field } from "../../../../components/Field";
import { inputBaseClass } from "../../../../components/InputBaseClass";

export function SectionFinanceiro({ formData, handleChange }) {
    return (
        <FormCard title="Plano e Pagamento" icon={Wallet} iconColor="bg-green-50 text-green-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Field label="Valor Mensalidade (R$) *">
                    <input
                        type="number"
                        name="valor_mensalidade"
                        value={formData.valor_mensalidade}
                        onChange={handleChange}
                        className={`${inputBaseClass} text-lg font-bold text-slate-800`}
                        step="0.01"
                        required
                    />
                </Field>

                <Field label="Data do 1º Vencimento *">
                    <input
                        type="date"
                        name="dia_vencimento"
                        value={formData.dia_vencimento}
                        onChange={handleChange}
                        className={inputBaseClass}
                        required
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card Plano Básico */}
                <label className={`group cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${formData.plano === 'basico'
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}>
                    <input
                        type="radio" name="plano" value="basico"
                        checked={formData.plano === 'basico'}
                        onChange={handleChange}
                        className="mt-1 accent-blue-600 w-4 h-4"
                    />
                    <div>
                        <span className="block font-bold text-slate-700">Plano Básico</span>
                        <span className="text-xs text-slate-500 leading-tight block mt-1">
                            Registro interno de mensalidades. Sem acesso ao App dos Pais.
                        </span>
                    </div>
                </label>

                {/* Card Plano Premium */}
                <label className={`group cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${formData.plano === 'premium'
                    ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-100'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}>
                    <input
                        type="radio" name="plano" value="premium"
                        checked={formData.plano === 'premium'}
                        onChange={handleChange}
                        className="mt-1 accent-amber-500 w-4 h-4"
                    />
                    <div>
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                            Premium <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </span>
                        <span className="text-xs text-slate-500 leading-tight block mt-1">
                            Libera acesso ao App, Diário Escolar e Notificações em tempo real.
                        </span>
                    </div>
                </label>
            </div>
        </FormCard>
    );
}