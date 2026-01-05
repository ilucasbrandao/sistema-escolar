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
    Phone
} from "lucide-react";
import api from "../../services/api";
import dayjs from "dayjs";
import { toast } from 'react-toastify';

// Função de máscara (Mesma do cadastro)
const maskPhone = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
};

// Formata data ISO para input date (YYYY-MM-DD)
const formatToInputDate = (isoString) => {
    if (!isoString) return "";
    return dayjs(isoString).format("YYYY-MM-DD");
};

export function EditarFuncionario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const hoje = new Date().toLocaleDateString("en-CA");

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Estado igual ao do Cadastro
    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        telefone: "",
        endereco: "",
        data_contratacao: "",
        nivel_ensino: "",
        turno: "",
        salario: "",
        status: "ativo",
    });

    // 1. CARREGAR DADOS
    useEffect(() => {
        async function fetchProfessor() {
            try {
                const { data } = await api.get(`/professores/${id}`);

                setFormData({
                    ...data,
                    // Garante que campos de texto não sejam null
                    nome: data.nome || "",
                    telefone: maskPhone(data.telefone || ""),
                    endereco: data.endereco || "",
                    nivel_ensino: data.nivel_ensino || "",
                    turno: data.turno || "",
                    salario: data.salario || "",
                    status: data.status || "ativo",
                    // Formata Datas para o Input
                    data_nascimento: formatToInputDate(data.data_nascimento),
                    data_contratacao: formatToInputDate(data.data_contratacao),
                });

            } catch (error) {
                console.error("Erro:", error);
                toast.error("Erro ao carregar dados do professor.");
                navigate("/professores");
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchProfessor();
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

        // Validações básicas
        if (!formData.nome.trim()) return toast.warn("Nome é obrigatório");
        if (!formData.salario) return toast.warn("Salário é obrigatório");

        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                salario: parseFloat(formData.salario),
            };

            await api.put(`/professores/${id}`, payload);
            toast.success("Professor atualizado com sucesso!");
            navigate("/professores");

        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao salvar alterações.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <Container className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-600 font-bold">Carregando dados...</div>
            </Container>
        );
    }

    // Estilos padronizados (Idênticos ao Alunos e Cadastro Professor)
    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputClass = "w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";

    return (
        <Container>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/professores")}
                    className="pl-0 text-slate-500 hover:text-slate-800"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                </Button>

                <div className="text-center">
                    <Title level={2} className="!mb-0">Editar Professor</Title>
                    <span className="text-xs text-slate-400 font-mono">ID #{id}</span>
                </div>

                <div className="w-20"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">

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
                                max={hoje}
                                className={inputClass}
                                disabled // Data de nascimento desabilitada na edição (padrão do sistema)
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
                                />
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Endereço Completo</label>
                            <div className="relative">
                                <input
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                />
                                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CONTRATO E FUNÇÃO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Contrato e Função</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nível de Ensino</label>
                                <select
                                    name="nivel_ensino"
                                    value={formData.nivel_ensino}
                                    onChange={handleChange}
                                    className={`${inputClass} bg-white`}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Infantil">Infantil</option>
                                    <option value="Fundamental">Fundamental</option>
                                    <option value="Especialista">Especialista</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Turno</label>
                                <select
                                    name="turno"
                                    value={formData.turno}
                                    onChange={handleChange}
                                    className={`${inputClass} bg-white`}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Manhã">Manhã</option>
                                    <option value="Tarde">Tarde</option>
                                    <option value="Integral">Integral</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. FINANCEIRO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Financeiro</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Salário Base (R$) *</label>
                            <input
                                type="number"
                                name="salario"
                                value={formData.salario}
                                onChange={handleChange}
                                className={`${inputClass} text-lg font-bold text-slate-700`}
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
                                className={`${inputClass} font-bold ${formData.status === 'ativo' ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}
                            >
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo (Desligado)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* BOTÕES */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/professores")}
                        className="text-slate-500"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-12 shadow-lg shadow-blue-200 border-none"
                    >
                        {isSaving ? "Salvando..." : (
                            <span className="flex items-center gap-2">
                                <Save className="w-5 h-5" /> Salvar Alterações
                            </span>
                        )}
                    </Button>
                </div>

            </form>
        </Container>
    );
}