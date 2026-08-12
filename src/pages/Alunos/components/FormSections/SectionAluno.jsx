import { User, GraduationCap, Clock, Calendar, Briefcase } from "lucide-react";
import { FormCard } from "../../../../components/FormCard";
import { Field } from "../../../../components/Field";
import { inputBaseClass } from "../../../../components/InputBaseClass";

export function SectionAluno({ formData, handleChange, hoje, professoresList = [] }) {
    // Filtra apenas professores ativos para exibição
    const professoresAtivos = (professoresList || []).filter((p) => p.status === "ativo");

    return (
        <FormCard title="Dados do Aluno" icon={User} iconColor="bg-blue-50 text-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Nome Completo */}
                <div className="md:col-span-2">
                    <Field label="Nome Completo *">
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome || ""}
                            onChange={handleChange}
                            className={inputBaseClass}
                            placeholder="Ex: João da Silva"
                            required
                        />
                    </Field>
                </div>

                {/* Data de Nascimento */}
                <Field label="Data de Nascimento">
                    <div className="relative">
                        <input
                            type="date"
                            name="data_nascimento"
                            value={formData.data_nascimento || ""}
                            onChange={handleChange}
                            max={hoje}
                            className={inputBaseClass}
                        />
                    </div>
                </Field>

                {/* Data de Matrícula */}
                <Field label="Data de Matrícula">
                    <input
                        type="date"
                        name="data_matricula"
                        value={formData.data_matricula || hoje}
                        onChange={handleChange}
                        className={inputBaseClass}
                    />
                </Field>

                {/* Série e Turno */}
                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <Field label="Série *">
                        <select
                            name="serie"
                            value={formData.serie || ""}
                            onChange={handleChange}
                            className={`${inputBaseClass} bg-white`}
                            required
                        >
                            <option value="">Selecione a série</option>
                            <optgroup label="Educação Infantil">
                                <option value="Infantil III">Infantil III</option>
                                <option value="Infantil IV">Infantil IV</option>
                                <option value="Infantil V">Infantil V</option>
                            </optgroup>
                            <optgroup label="Ensino Fundamental I">
                                <option value="1º ano">1º ano</option>
                                <option value="2º ano">2º ano</option>
                                <option value="3º ano">3º ano</option>
                                <option value="4º ano">4º ano</option>
                                <option value="5º ano">5º ano</option>
                            </optgroup>
                            <optgroup label="Ensino Fundamental II">
                                <option value="6º ano">6º ano</option>
                                <option value="7º ano">7º ano</option>
                                <option value="8º ano">8º ano</option>
                                <option value="9º ano">9º ano</option>
                            </optgroup>
                        </select>
                    </Field>

                    <Field label="Turno *">
                        <select
                            name="turno"
                            value={formData.turno || ""}
                            onChange={handleChange}
                            className={`${inputBaseClass} bg-white`}
                            required
                        >
                            <option value="">Selecione o turno</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                        </select>
                    </Field>

                    {/* Seleção do Horário/Slot Específico (2 horas) */}
                    <Field label="Faixa Horária (2h) *">
                        <select
                            name="horario_atendimento"
                            value={formData.horario_atendimento || ""}
                            onChange={handleChange}
                            className={`${inputBaseClass} bg-white`}
                            disabled={!formData.turno}
                            required
                        >
                            <option value="">Selecione o horário</option>

                            {formData.turno === "Manhã" && (
                                <>
                                    <option value="08:00 - 10:00">08:00 às 10:00</option>
                                    <option value="09:00 - 11:00">09:00 às 11:00</option>
                                </>
                            )}

                            {formData.turno === "Tarde" && (
                                <>
                                    <option value="13:00 - 15:00">13:00 às 15:00</option>
                                    <option value="14:00 - 16:00">14:00 às 16:00</option>
                                    <option value="15:00 - 17:00">15:00 às 17:00</option>
                                    <option value="16:00 - 18:00">16:00 às 18:00</option>
                                </>
                            )}
                        </select>
                    </Field>

                    <Field label="Professor Responsável / Tutor">
                        <select
                            name="professor_id"
                            value={formData.professor_id || ""}
                            onChange={handleChange}
                            className={`${inputBaseClass} bg-white`}
                        >
                            <option value="">
                                {professoresAtivos.length === 0
                                    ? "Nenhum professor ativo encontrado"
                                    : "Nenhum professor selecionado"}
                            </option>
                            {professoresAtivos.map((prof) => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.nome} {prof.materia ? `(${prof.materia})` : ""}
                                </option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">
                            Vincula o aluno ao diário de classe do professor selecionado.
                        </p>
                    </Field>
                </div>

            </div>
        </FormCard>
    );
}