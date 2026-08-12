import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import {
    ChevronLeftIcon,
    Save,
    User,
    Briefcase,
    Banknote,
    MapPin,
    Phone,
    Mail,
    Loader2,
    Users
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";

// Função para aplicar máscara de telefone
const maskPhone = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
};

// Converte strings de data ISO do banco para 'YYYY-MM-DD' sem perda por timezone
const formatToInputDate = (dateStr) => {
    if (!dateStr) return "";

    // Se já for um objeto Date, converte para ISO
    const str = dateStr instanceof Date ? dateStr.toISOString() : String(dateStr);

    // Extrai apenas os primeiros 10 caracteres "YYYY-MM-DD"
    // sem passar por new Date() ou fusos horários
    const dateOnly = str.split("T")[0];

    // Validação simples de formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
        return dateOnly;
    }

    return "";
};

export function EditarFuncionario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        data_nascimento: "",
        telefone: "",
        endereco: "",
        data_contratacao: "",
        nivel_ensino: "",
        turno: "",
        salario: "",
        status: "ativo",
        alunos_ids: [],
    });

    // 1. CARREGAR DADOS DO PROFESSOR E LISTA DE ALUNOS
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoadingData(true);
                const [resProf, resAlunos] = await Promise.all([
                    api.get(`/professores/${id}`),
                    api.get("/alunos").catch(() => ({ data: [] })),
                ]);

                const data = resProf.data;
                const alunosList = resAlunos.data || [];
                setAlunosDisponiveis(alunosList);

                // Extrai os IDs dos alunos atualmente alocados ao professor
                const alunosVinculadosIds = data.alunos
                    ? data.alunos.map((a) => a.id)
                    : data.professores_alunos
                        ? data.professores_alunos.map((pa) => pa.aluno_id || pa.aluno?.id)
                        : [];

                setFormData({
                    ...data,
                    nome: data.nome || "",
                    email: data.email || data.user?.email || "",
                    telefone: maskPhone(data.telefone || ""),
                    endereco: data.endereco || "",
                    nivel_ensino: data.nivel_ensino || "",
                    turno: data.turno || "",
                    salario: data.salario || "",
                    status: data.status || "ativo",
                    // Garante a data exata sem recuar 1 dia
                    data_nascimento: formatToInputDate(data.data_nascimento),
                    data_contratacao: formatToInputDate(data.data_contratacao),
                    alunos_ids: alunosVinculadosIds.filter(Boolean),
                });
            } catch (error) {
                console.error("❌ Erro ao buscar dados do professor:", error);
                toast.error("Erro ao carregar dados do professor.");
                navigate("/professores");
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "telefone") {
            newValue = maskPhone(value);
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    // Manipulador para marcar/desmarcar alunos
    const handleAlunoToggle = (alunoId) => {
        setFormData((prev) => {
            const jaSelecionado = prev.alunos_ids.includes(alunoId);
            return {
                ...prev,
                alunos_ids: jaSelecionado
                    ? prev.alunos_ids.filter((aId) => aId !== alunoId)
                    : [...prev.alunos_ids, alunoId],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome.trim()) return toast.warn("Nome é obrigatório");
        if (!formData.salario) return toast.warn("Salário é obrigatório");

        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                email: formData.email ? formData.email.trim().toLowerCase() : undefined,
                salario: parseFloat(formData.salario),
                alunos_ids: formData.alunos_ids,
            };

            await api.put(`/professores/${id}`, payload);
            toast.success("Professor(a) atualizado(a) com sucesso!");
            navigate("/professores");
        } catch (error) {
            console.error("❌ Erro ao atualizar professor:", error);
            const msg = error.response?.data?.error || "Erro ao salvar alterações.";
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <Container className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-slate-500 font-medium text-sm">
                        Carregando dados do professor...
                    </span>
                </div>
            </Container>
        );
    }

    const labelClass =
        "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputClass =
        "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-sm";

    return (
        <Container className="pb-28">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/professores")}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Button>
                    <div>
                        <Title level={2} className="!mb-0 text-2xl font-bold text-slate-800">
                            Editar Professor
                        </Title>
                        <span className="text-xs text-slate-400 font-mono">ID #{id}</span>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">

                {/* 1. DADOS PESSOAIS E LOGIN */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">
                            Dados Pessoais & Credenciais
                        </h3>
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

                        {/* Campo E-mail Liberado para edição */}
                        <div>
                            <label className={labelClass}>E-mail de Acesso (Login)</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    placeholder="professor@espacoalpe.com.br"
                                />
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>

                        {/* Campo Data de Nascimento Liberado para edição */}
                        <div>
                            <label className={labelClass}>Data de Nascimento</label>
                            <input
                                type="date"
                                name="data_nascimento"
                                value={formData.data_nascimento}
                                onChange={handleChange}
                                max={hoje}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Telefone / WhatsApp</label>
                            <div className="relative">
                                <input
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    maxLength={15}
                                    placeholder="(00) 00000-0000"
                                />
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Endereço Completo</label>
                            <div className="relative">
                                <input
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    placeholder="Rua, Número, Bairro, Cidade"
                                />
                                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CONTRATO E FUNÇÃO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">
                            Contrato e Função
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className={labelClass}>Data de Contratação</label>
                            <input
                                type="date"
                                name="data_contratacao"
                                value={formData.data_contratacao}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Nível de Ensino</label>
                            <select
                                name="nivel_ensino"
                                value={formData.nivel_ensino}
                                onChange={handleChange}
                                className={`${inputClass} bg-slate-50`}
                            >
                                <option value="">Selecione...</option>
                                <option value="Educação Infantil">Educação Infantil</option>
                                <option value="Ensino Fundamental I">Ensino Fundamental I</option>
                                <option value="Ensino Fundamental II">Ensino Fundamental II</option>
                                <option value="Acompanhamento Geral">Acompanhamento Geral</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Turno</label>
                            <select
                                name="turno"
                                value={formData.turno}
                                onChange={handleChange}
                                className={`${inputClass} bg-slate-50`}
                            >
                                <option value="">Selecione...</option>
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noite">Noite</option>
                                <option value="Integral">Integral</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. FINANCEIRO & STATUS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">Financeiro</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Salário Base (R$) *</label>
                            <input
                                type="number"
                                name="salario"
                                value={formData.salario}
                                onChange={handleChange}
                                className={`${inputClass} font-semibold text-slate-800 text-base`}
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Status do Contrato</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`${inputClass} font-semibold ${formData.status === "ativo"
                                    ? "text-emerald-700 bg-emerald-50/50"
                                    : "text-rose-700 bg-rose-50/50"
                                    }`}
                            >
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo (Desligado)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 4. ALOCAÇÃO DE ALUNOS VINCULADOS */}
                {alunosDisponiveis.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">
                                    Alunos Acompanhados ({formData.alunos_ids.length})
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Marque ou desmarque os estudantes alocados a este professor
                                </p>
                            </div>
                        </div>

                        <div className="max-h-52 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-1">
                            {alunosDisponiveis.map((aluno) => {
                                const checked = formData.alunos_ids.includes(aluno.id);
                                return (
                                    <label
                                        key={aluno.id}
                                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${checked
                                            ? "bg-blue-50 border-blue-300 text-blue-800"
                                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => handleAlunoToggle(aluno.id)}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="truncate">{aluno.nome}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Footer Flutuante / Sticky */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40 shadow-lg">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/professores")}
                            className="hidden sm:inline-flex text-slate-600 hover:bg-slate-100"
                        >
                            Descartar e Voltar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-blue-200 transition flex items-center gap-2 min-w-[200px] justify-center ml-auto"
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
            </form>
        </Container>
    );
}