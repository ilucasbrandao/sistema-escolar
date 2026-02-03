import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import {
    ChevronLeftIcon,
    Save,
    User,
    Users,
    Wallet,
    Crown
} from "lucide-react";
import api from "../../services/api";
import { toast } from 'react-toastify';

// Função utilitária para máscara
const maskPhone = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
};

export default function CadastroAlunos() {
    const navigate = useNavigate();
    const hoje = new Date().toLocaleDateString("en-CA");
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        responsavel: "",
        plano: "basico", // basico ou premium
        email_responsavel: "",
        telefone: "",
        data_matricula: hoje,
        valor_mensalidade: "",
        dia_vencimento: hoje, // Agora é uma data completa (YYYY-MM-DD)
        serie: "",
        turno: "",
        observacao: "",
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

        // --- Validação ---
        if (!formData.nome.trim()) return toast.warn("Nome do aluno é obrigatório");
        if (!formData.responsavel.trim()) return toast.warn("Nome do responsável é obrigatório");
        if (!formData.serie) return toast.warn("Selecione a série");
        if (!formData.turno) return toast.warn("Selecione o turno");
        if (!formData.valor_mensalidade) return toast.warn("Informe o valor da mensalidade");

        if (formData.plano === 'premium' && !formData.email_responsavel) {
            return toast.warn("Para o plano Premium, o email é obrigatório para login no App.");
        }

        setIsLoading(true);

        try {
            const diaVencimento = formData.dia_vencimento.split("-")[2];

            const payload = {
                ...formData,
                valor_mensalidade: Number(formData.valor_mensalidade),
                dia_vencimento: diaVencimento.toString(), // Salva "10", "20", etc.
                email_responsavel: formData.plano === 'basico' ? null : formData.email_responsavel
            };

            const response = await api.post("/alunos", payload);

            if (response.data.acesso) {
                toast.success(`Aluno Premium Cadastrado!`);
            } else {
                toast.success("Aluno cadastrado com sucesso!");
            }

            navigate("/alunos");

        } catch (error) {
            console.error("Erro:", error);
            const msg = error.response?.data?.error || "Erro ao salvar aluno.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Estilos reutilizáveis para garantir padronização
    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputClass = "w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400";

    return (
        <Container>
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/alunos")}
                    className="pl-0 text-slate-500 hover:text-slate-800"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                </Button>
                <Title level={2} className="!mb-0">Nova Matrícula</Title>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">

                {/* 1. DADOS PESSOAIS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Dados do Aluno</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Nome Completo *</label>
                            <input
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Ex: João da Silva"
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
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Série *</label>
                                <select name="serie" value={formData.serie} onChange={handleChange} className={`${inputClass} bg-white`}>
                                    <option value="">Selecione</option>
                                    <option value="Infantil III">Infantil III</option>
                                    <option value="Infantil IV">Infantil IV</option>
                                    <option value="Infantil V">Infantil V</option>
                                    <option value="Fundamental 1">Fund. 1</option>
                                    <option value="Fundamental 2">Fund. 2</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Turno *</label>
                                <select name="turno" value={formData.turno} onChange={handleChange} className={`${inputClass} bg-white`}>
                                    <option value="">Selecione</option>
                                    <option value="Manhã">Manhã</option>
                                    <option value="Tarde">Tarde</option>
                                </select>
                            </div>
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
                                placeholder="Pai, Mãe ou Responsável Legal"
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
                                placeholder="(00) 00000-0000"
                                maxLength={15}
                            />
                        </div>

                        <div className={formData.plano === 'premium' ? 'block' : 'hidden md:block'}>
                            <label className={labelClass}>
                                Email {formData.plano === 'premium' && <span className="text-amber-500">(Obrigatório)</span>}
                            </label>
                            <input
                                type="email"
                                name="email_responsavel"
                                value={formData.email_responsavel}
                                onChange={handleChange}
                                className={`${inputClass} ${formData.plano === 'premium' ? 'border-amber-300 bg-amber-50 focus:ring-amber-400' : ''}`}
                                placeholder="email@exemplo.com"
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
                        <h3 className="font-bold text-slate-700">Plano e Pagamento</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className={labelClass}>Valor Mensalidade (R$) *</label>
                            <input
                                type="number"
                                name="valor_mensalidade"
                                value={formData.valor_mensalidade}
                                onChange={handleChange}
                                className={`${inputClass} text-lg font-bold text-slate-800`}
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Data do 1º Vencimento *</label>
                            {/* Alterado para input DATE conforme solicitado */}
                            <input
                                type="date"
                                name="dia_vencimento"
                                value={formData.dia_vencimento}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">
                                O sistema usará este dia para gerar as cobranças futuras.
                            </p>
                        </div>
                    </div>

                    {/* SELEÇÃO VISUAL DE PLANO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Plano Básico */}
                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${formData.plano === 'basico' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                            <input type="radio" name="plano" value="basico" checked={formData.plano === 'basico'} onChange={handleChange} className="mt-1 accent-blue-600" />
                            <div>
                                <span className="block font-bold text-slate-700">Plano Básico</span>
                                <span className="text-xs text-slate-500 block mt-1 leading-snug">Apenas registro interno. Sem acesso ao aplicativo.</span>
                            </div>
                        </label>

                        {/* Plano Premium */}
                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${formData.plano === 'premium' ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                            <input type="radio" name="plano" value="premium" checked={formData.plano === 'premium'} onChange={handleChange} className="mt-1 accent-amber-500" />
                            <div>
                                <span className="font-bold text-slate-700 flex items-center gap-2">
                                    Premium <Crown className="w-4 h-4 text-amber-500 fill-current" />
                                </span>
                                <span className="text-xs text-slate-500 block mt-1 leading-snug">
                                    Acesso ao App dos Pais, Diário e Notificações.
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* 4. OBSERVAÇÕES */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <label className={labelClass}>Observações Adicionais</label>
                    <textarea
                        name="observacao"
                        value={formData.observacao}
                        onChange={handleChange}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="Alergias, restrições alimentares ou comportamentais..."
                    />
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/alunos")}
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
                                <Save className="w-5 h-5" /> Matricular Aluno
                            </span>
                        )}
                    </Button>
                </div>

            </form>
        </Container>
    );
}