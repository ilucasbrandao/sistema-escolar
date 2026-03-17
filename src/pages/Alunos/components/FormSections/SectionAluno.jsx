import { User } from "lucide-react";
import { FormCard } from "../../../../components/FormCard";
import { Field } from "../../../../components/Field";
import { inputBaseClass } from "../../../../components/InputBaseClass";

export function SectionAluno({ formData, handleChange, hoje }) {
    return (
        <FormCard title="Dados do Aluno" icon={User} iconColor="bg-blue-50 text-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <Field label="Nome Completo *">
                        <input name="nome" value={formData.nome} onChange={handleChange} className={inputBaseClass} placeholder="Ex: João da Silva" required />
                    </Field>
                </div>
                <Field label="Data de Nascimento">
                    <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} max={hoje} className={inputBaseClass} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Série *">
                        <select name="serie" value={formData.serie} onChange={handleChange} className={`${inputBaseClass} bg-white`} required>
                            <option value="">Selecione</option>
                            <option value="Infantil III">Infantil III</option>
                            <option value="Infantil IV">Infantil IV</option>
                            <option value="Infantil V">Infantil V</option>
                            <option value="Fundamental I">Fundamental I</option>
                            <option value="Fundamental II">Fundamental II</option>

                        </select>
                    </Field>
                    <Field label="Turno *">
                        <select name="turno" value={formData.turno} onChange={handleChange} className={`${inputBaseClass} bg-white`} required>
                            <option value="">Selecione</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                        </select>
                    </Field>
                </div>
            </div>
        </FormCard>
    );
}