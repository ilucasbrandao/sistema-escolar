import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import {
    ChevronLeftIcon,
    Save,
    User,
    Users,
    Wallet,
    Crown,
    Loader2,
    Clock,
    Briefcase
} from "lucide-react";
import dayjs from "dayjs";
import { toast } from 'react-toastify';

// Função de máscara
const maskPhone = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
};

// Formata data ISO para input date
const formatToInputDate = (isoString) => {
    if (!isoString) return "";
    return dayjs(isoString).format("YYYY-MM-DD");
};

export function EditarAluno() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [professoresList, setProfessoresList] = useState([]);

    // Estado Inicial
    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        responsavel: "",
        plano: "basico",
        email_responsavel: "",
        telefone: "",
        data_matricula: "",
        valor_mensalidade: "",
        dia_vencimento: "",
        serie: "",
        turno: "",
        horario_atendimento: "",
        professor_id: "",
        observacao: "",
        status: "ativo",
    });

    // 1. CARREGAR DADOS DO ALUNO E PROFESSORES
    useEffect(() => {
        async function loadData() {
            try {
                const [resAluno, resProfessores] = await Promise.all([
                    api.get(`/alunos/${id}`),
                    api.get("/professores").catch(() => ({ data: [] }))
                ]);

                const data = resAluno.data;
                const profsAtivos = (resProfessores.data || []).filter(p => p.status === "ativo");
                setProfessoresList(profsAtivos);

                // Identifica se existe um professor vinculado no array professores_alunos
                const profVinculadoId = data.professores_alunos?.[0]?.professor_id
                    || data.professor_id
                    || "";

                // Lógica para o dia de vencimento
                const diaVenc = data.dia_vencimento ? parseInt(data.dia_vencimento) : 5;
                const dataVencimentoFake = dayjs().date(diaVenc).format("YYYY-MM-DD");

                // Preenche o formulário
                setFormData({
                    ...data,
                    nome: data.nome || "",
                    responsavel: data.responsavel || "",
                    serie: data.serie || "",
                    turno: data.turno || "",
                    horario_atendimento: data.horario_atendimento || "",
                    professor_id: profVinculadoId,
                    observacao: data.observacao || "",
                    status: data.status || "ativo",
                    data_nascimento: formatToInputDate(data.data_nascimento),
                    data_matricula: formatToInputDate(data.data_matricula),
                    dia_vencimento: dataVencimentoFake,
                    telefone: maskPhone(data.telefone || ""),
                    plano: data.plano || "basico",
                    email_responsavel: data.email_responsavel || ""
                });

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                toast.error("Erro ao carregar dados do aluno.");
                navigate("/alunos");
            } finally {
                setIsLoadingData(false);
            }
        }
        loadData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "telefone") {
            newValue = maskPhone(value);
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome.trim()) return toast.warn("Nome é obrigatório");
        if (!formData.responsavel.trim()) return toast.warn("Responsável é obrigatório");
        if (!formData.serie) return toast.warn("Série é obrigatória");
        if (!formData.turno) return toast.warn("Turno é obrigatório");

        if (formData.plano === 'premium' && !formData.email_responsavel) {
            return toast.warn("Email é obrigatório para o plano Premium!");
        }

        try {
            setIsSaving(true);

            const diaVencimento = dayjs(formData.dia_vencimento).date();

            const payload = {
                ...formData,
                valor_mensalidade: Number(formData.valor_mensalidade),
                dia_vencimento: diaVencimento.toString(),
                email_responsavel: formData.plano === 'basico' ? null : formData.email_responsavel,
                professor_id: formData.professor_id ? Number(formData.professor_id) : null,
            };

            await api.put(`/alunos/${id}`, payload);
            toast.success("Dados atualizados com sucesso!");
            navigate("/alunos");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar alterações.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <Container className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-slate-500 font-medium text-sm">Carregando dados do aluno...</span>
                </div>
            </Container>
        );
    }

    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputClass = "w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";

    return (
        <Container className="pb-24">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/alunos")}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                </Button>

                <div className="text-center">
                    <Title level={2} className="!mb-0 text-2xl font-bold text-slate-800">Editar Aluno</Title>
                    <span className="text-xs text-slate-400 font-mono">Matrícula #{id}</span>
                </div>

                <div className="w-20"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">

                {/* 1. DADOS PESSOAIS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Dados Pessoais</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Nome Completo *</label>
                            <input
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Data de Nascimento</label>
                            <input
                                type="date"
                                name="data_nascimento"
                                value={formData.data_nascimento}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Data de Matrícula</label>
                            <input
                                type="date"
                                name="data_matricula"
                                value={formData.data_matricula}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        {/* Série e Turno */}
                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <div>
                                <label className={labelClass}>Série *</label>
                                <select
                                    name="serie"
                                    value={formData.serie}
                                    onChange={handleChange}
                                    className={`${inputClass} bg-white`}
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
                            </div>

                            <div>
                                <label className={labelClass}>Turno *</label>
                                <select
                                    name="turno"
                                    value={formData.turno}
                                    onChange={handleChange}
                                    className={`${inputClass} bg-white`}
                                    required
                                >
                                    <option value="">Selecione o turno</option>
                                    <option value="Manhã">Manhã</option>
                                    <option value="Tarde">Tarde</option>
                                </select>
                            </div>

                            {/* Faixa Horária (2h) */}
                            <div className="col-span-2">
                                <label className={labelClass}>Faixa Horária (2h) *</label>
                                <select
                                    name="horario_atendimento"
                                    value={formData.horario_atendimento}
                                    onChange={handleChange}
                                    className={`${inputClass} bg-white`}
                                    disabled={!formData.turno}
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
                            </div>
                        </div>

                        {/* Professor Responsável / Tutor */}
                        <div className="md:col-span-2">
                            <label className={labelClass}>Professor Responsável / Tutor</label>
                            <select
                                name="professor_id"
                                value={formData.professor_id}
                                onChange={handleChange}
                                className={`${inputClass} bg-white`}
                            >
                                <option value="">
                                    {professoresList.length === 0
                                        ? "Nenhum professor ativo encontrado"
                                        : "Nenhum professor selecionado"}
                                </option>
                                {professoresList.map((prof) => (
                                    <option key={prof.id} value={prof.id}>
                                        {prof.nome} {prof.materia ? `(${prof.materia})` : ""}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[11px] text-slate-400 mt-1 ml-1">
                                Vincula o aluno ao diário de classe do professor selecionado.
                            </p>
                        </div>

                    </div>
                </div>

                {/* 2. RESPONSÁVEL */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Responsável</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Nome do Responsável *</label>
                            <input
                                name="responsavel"
                                value={formData.responsavel}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>WhatsApp / Telefone</label>
                            <input
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                className={inputClass}
                                maxLength={15}
                            />
                        </div>

                        <div className={formData.plano === 'premium' ? 'block' : 'block md:block'}>
                            <label className={labelClass}>
                                Email {formData.plano === 'premium' && <span className="text-amber-500">(Obrigatório)</span>}
                            </label>
                            <input
                                type="email"
                                name="email_responsavel"
                                value={formData.email_responsavel}
                                onChange={handleChange}
                                className={`${inputClass} ${formData.plano === 'premium' ? 'border-amber-300 bg-amber-50 focus:ring-amber-400' : ''}`}
                                required={formData.plano === 'premium'}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. FINANCEIRO & PLANO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Financeiro & Plano</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className={labelClass}>Mensalidade (R$) *</label>
                            <input
                                type="number"
                                name="valor_mensalidade"
                                value={formData.valor_mensalidade}
                                onChange={handleChange}
                                className={`${inputClass} text-lg font-bold text-slate-800`}
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Data de Vencimento</label>
                            <input
                                type="date"
                                name="dia_vencimento"
                                value={formData.dia_vencimento}
                                onChange={handleChange}
                                className={inputClass}
                            />
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">
                                O dia selecionado será usado para os vencimentos mensais.
                            </p>
                        </div>
                    </div>

                    {/* STATUS */}
                    <div className="mb-6">
                        <label className={labelClass}>Status da Matrícula</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`${inputClass} font-bold ${formData.status === 'ativo' ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}
                        >
                            <option value="ativo">Ativo (Cursando)</option>
                            <option value="inativo">Inativo (Cancelado/Trancado)</option>
                        </select>
                    </div>

                    {/* PLANOS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${formData.plano === 'basico' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                            <input type="radio" name="plano" value="basico" checked={formData.plano === 'basico'} onChange={handleChange} className="mt-1 accent-blue-600" />
                            <div>
                                <span className="block font-bold text-slate-700">Plano Básico</span>
                                <span className="text-xs text-slate-500 block mt-1 leading-snug">Sem acesso ao aplicativo.</span>
                            </div>
                        </label>

                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${formData.plano === 'premium' ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                            <input type="radio" name="plano" value="premium" checked={formData.plano === 'premium'} onChange={handleChange} className="mt-1 accent-amber-500" />
                            <div>
                                <span className="font-bold text-slate-700 flex items-center gap-2">
                                    Premium <Crown className="w-4 h-4 text-amber-500 fill-current" />
                                </span>
                                <span className="text-xs text-slate-500 block mt-1 leading-snug">
                                    Acesso ao App + Diário.
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* 4. OBSERVAÇÕES */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <label className={labelClass}>Observações Pedagógicas & Restrições</label>
                    <textarea
                        name="observacao"
                        value={formData.observacao}
                        onChange={handleChange}
                        className={`${inputClass} min-h-[90px] resize-y`}
                        placeholder="Alergias, restrições alimentares, dificuldades de aprendizagem ou observações gerais..."
                    />
                </div>

                {/* FOOTER STICKY/FIXO */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40 shadow-lg">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/alunos")}
                            className="text-slate-600 hover:bg-slate-100"
                        >
                            Descartar e Voltar
                        </Button>

                        <div className="flex items-center gap-3">
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-blue-200 transition flex items-center gap-2 min-w-[200px] justify-center"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Salvar Alterações</span>
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