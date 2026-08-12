import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function CadastroProfessor() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];
    const [isLoading, setIsLoading] = useState(false);
    const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);

    const [formData, setFormData] = useState({
        nome: "",
        email: "", // <-- Adicionado para integração com login/users
        data_nascimento: "",
        telefone: "",
        endereco: "",
        data_contratacao: hoje,
        nivel_ensino: "",
        turno: "Tarde",
        salario: "",
        status: "ativo",
        alunos_ids: [],
    });

    // Busca lista de alunos para vinculo opcional inicial
    useEffect(() => {
        async function carregarAlunos() {
            try {
                const { data } = await api.get("/alunos");
                setAlunosDisponiveis(data || []);
            } catch (err) {
                console.error("Erro ao carregar lista de alunos:", err);
            }
        }
        carregarAlunos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "telefone") {
            newValue = maskPhone(value);
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    // Manipulador para seleção de múltiplos alunos
    const handleAlunoToggle = (alunoId) => {
        setFormData((prev) => {
            const jaSelecionado = prev.alunos_ids.includes(alunoId);
            return {
                ...prev,
                alunos_ids: jaSelecionado
                    ? prev.alunos_ids.filter((id) => id !== alunoId)
                    : [...prev.alunos_ids, alunoId],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validações no Frontend
        if (!formData.nome.trim()) return toast.warn("Nome completo é obrigatório");
        if (!formData.email.trim()) return toast.warn("E-mail é obrigatório para gerar o login");
        if (!formData.data_nascimento) return toast.warn("Data de nascimento é obrigatória");
        if (!formData.salario) return toast.warn("Informe o salário base");
        if (!formData.turno) return toast.warn("Selecione o turno de atendimento");

        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                email: formData.email.trim().toLowerCase(),
                salario: parseFloat(formData.salario),
            };

            const response = await api.post("/professores", payload);

            toast.success(
                <div>
                    <p className="font-bold">Professor(a) cadastrado(a)!</p>
                    {response.data?.acesso?.senhaInicial && (
                        <p className="text-xs mt-1">
                            Senha temporária de acesso: <strong>{response.data.acesso.senhaInicial}</strong>
                        </p>
                    )}
                </div>,
                { autoClose: 6000 }
            );

            navigate("/professores");
        } catch (error) {
            console.error("❌ Erro ao cadastrar professor:", error);
            const mensagemErro =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Erro ao cadastrar professor(a). Verifique os dados informados.";

            toast.error(mensagemErro);
        } finally {
            setIsLoading(false);
        }
    };

    // Classes utilitárias reutilizáveis para paridade com Alunos
    const labelClass =
        "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputClass =
        "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-sm";

    return (
        <Container className="pb-28">
            {/* Header com Navegação Limpa */}
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
                            Novo Professor
                        </Title>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Cadastre as informações do docente e crie o usuário de acesso ao sistema
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">

                {/* 1. DADOS PESSOAIS E CONTA DE ACESSO */}
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
                                placeholder="Ex: Maria Oliveira"
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>E-mail de Acesso (Login) *</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    placeholder="professor@espacoalpe.com.br"
                                    required
                                />
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Data de Nascimento *</label>
                            <input
                                type="date"
                                name="data_nascimento"
                                value={formData.data_nascimento}
                                onChange={handleChange}
                                max={hoje}
                                className={inputClass}
                                required
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
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
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
                        <h3 className="font-bold text-slate-800 text-base">Contrato e Turno</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className={labelClass}>Data de Contratação *</label>
                            <input
                                type="date"
                                name="data_contratacao"
                                value={formData.data_contratacao}
                                onChange={handleChange}
                                className={inputClass}
                                required
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
                            <label className={labelClass}>Turno Principal *</label>
                            <select
                                name="turno"
                                value={formData.turno}
                                onChange={handleChange}
                                className={`${inputClass} bg-slate-50`}
                                required
                            >
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
                        <h3 className="font-bold text-slate-800 text-base">
                            Valores e Situação
                        </h3>
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
                                placeholder="0.00"
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

                {/* 4. ALOCAÇÃO INICIAL DE ALUNOS (OPCIONAL) */}
                {alunosDisponiveis.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">
                                    Alocação de Alunos (Opcional)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Selecione os estudantes que serão acompanhados por este professor
                                </p>
                            </div>
                        </div>

                        <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-1">
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

                {/* Footer Flutuante / Sticky para paridade total com CadastroAlunos */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40 shadow-lg">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/professores")}
                            className="hidden sm:inline-flex text-slate-600 hover:bg-slate-100"
                        >
                            Cancelar e Voltar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-blue-200 transition flex items-center gap-2 min-w-[200px] justify-center ml-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Cadastrando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Finalizar Cadastro</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Container>
    );
}