import { useState } from "react";
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
    Phone
} from "lucide-react";
import api from "../../services/api";
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

export default function CadastroProfessor() {
    const navigate = useNavigate();
    const hoje = new Date().toLocaleDateString("en-CA");
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        telefone: "",
        endereco: "",
        data_contratacao: hoje,
        nivel_ensino: "",
        turno: "",
        salario: "",
        status: "ativo",
    });

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

        // Validação
        if (!formData.nome.trim()) return toast.warn("Nome é obrigatório");
        if (!formData.data_nascimento) return toast.warn("Data de nascimento é obrigatória");
        if (!formData.salario) return toast.warn("Salário é obrigatório");
        if (!formData.turno) return toast.warn("Selecione o turno");

        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                salario: parseFloat(formData.salario),
            };

            await api.post("/professores", payload);
            toast.success("Professor(a) cadastrado com sucesso!");

            navigate("/professores");

        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao cadastrar. Verifique os dados.");
        } finally {
            setIsLoading(false);
        }
    };

    // Estilos padronizados (Idênticos ao Alunos)
    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputClass = "w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400";

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
                <Title level={2} className="!mb-0">Novo Professor</Title>
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
                                placeholder="Ex: Maria Oliveira"
                                required
                            />
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
                                    placeholder="Rua, Número, Bairro, Cidade"
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nível de Ensino</label>
                                <select name="nivel_ensino" value={formData.nivel_ensino} onChange={handleChange} className={`${inputClass} bg-white`}>
                                    <option value="">Selecione</option>
                                    <option value="Infantil">Infantil</option>
                                    <option value="Fundamental">Fundamental</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Turno *</label>
                                <select name="turno" value={formData.turno} onChange={handleChange} className={`${inputClass} bg-white`}>
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
                                className={`${inputClass} font-bold ${formData.status === 'ativo' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
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
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-12 shadow-lg shadow-blue-200 border-none"
                    >
                        {isLoading ? "Salvando..." : (
                            <span className="flex items-center gap-2">
                                <Save className="w-5 h-5" /> Cadastrar Professor
                            </span>
                        )}
                    </Button>
                </div>

            </form>
        </Container>
    );
}