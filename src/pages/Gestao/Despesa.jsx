import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // <--- Importei useSearchParams
import dayjs from "dayjs";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import {
    ChevronLeftIcon,
    Save,
    Banknote,
    Calendar,
    FileText,
    Tag,
    User
} from "lucide-react";
import api from "../../services/api";
import { toast } from 'react-toastify';

function formatDateForInputSafe(dateISO) {
    if (!dateISO) return "";
    return dayjs(dateISO).format("YYYY-MM-DD");
}

export default function CadastroDespesa() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // <--- Hook para ler a URL

    const hoje = dayjs().format("YYYY-MM-DD");
    const mesAtual = dayjs().month() + 1;
    const anoAtual = dayjs().year();

    const [professores, setProfessores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        id_professor: "",
        valor: "",
        data_pagamento: hoje,
        mes_referencia: mesAtual,
        ano_referencia: anoAtual,
        descricao: "",
        categoria: "",
    });

    const categorias = [
        { label: "Salários", value: "salarios" },
        { label: "Material de Escritório", value: "material" },
        { label: "Aluguel", value: "aluguel" },
        { label: "Água", value: "agua" },
        { label: "Energia", value: "energia" },
        { label: "Internet", value: "internet" },
        { label: "Manutenção", value: "manutencao" },
        { label: "Lanche/Cozinha", value: "alimentacao" },
        { label: "Outros", value: "outros" },
    ];

    // 1. Carregar Professores e Verificar URL
    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                const res = await api.get("/professores");
                setProfessores(res.data);

                // --- LÓGICA DE AUTO-SELEÇÃO ---
                const profIdUrl = searchParams.get("profId");
                const tipoUrl = searchParams.get("tipo");

                if (profIdUrl) {
                    // Encontra o professor para garantir que o ID é válido (opcional, mas bom pra evitar bugs)
                    const professorExiste = res.data.find(p => String(p.id) === String(profIdUrl));

                    if (professorExiste) {
                        setFormData(prev => ({
                            ...prev,
                            id_professor: profIdUrl,
                            // Se veio tipo=salario, já preenche a categoria
                            categoria: tipoUrl === 'salario' ? 'salarios' : prev.categoria
                        }));
                    }
                }
                // ------------------------------

            } catch (error) {
                console.error("Erro ao carregar professores:", error);
                toast.error("Erro ao carregar lista de professores.");
            }
        }
        carregarDadosIniciais();
    }, [searchParams]);

    // 2. Auto-Preencher Descrição (Atualizado para incluir nome do professor se selecionado)
    useEffect(() => {
        const catLabel = categorias.find(c => c.value === formData.categoria)?.label || "Despesa";
        let novaDescricao = "";

        // Se for salário e tiver professor selecionado, personaliza a descrição
        if (formData.categoria === 'salarios' && formData.id_professor) {
            const nomeProf = professores.find(p => String(p.id) === String(formData.id_professor))?.nome || "Professor";
            novaDescricao = `Salário - ${nomeProf} - ${formData.mes_referencia}/${formData.ano_referencia}`;
        } else {
            // Descrição padrão
            novaDescricao = formData.categoria
                ? `${catLabel} referente a ${formData.mes_referencia}/${formData.ano_referencia}`
                : `Despesa referente a ${formData.mes_referencia}/${formData.ano_referencia}`;
        }

        // Só atualiza se o usuário ainda não digitou uma descrição manual muito diferente
        // (Aqui forçamos a atualização para facilitar, mas o usuário pode editar depois)
        setFormData(prev => ({ ...prev, descricao: novaDescricao }));

    }, [formData.categoria, formData.mes_referencia, formData.ano_referencia, formData.id_professor, professores]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação
        if (!formData.valor || Number(formData.valor) <= 0) return toast.warn("Informe um valor válido.");
        if (!formData.categoria) return toast.warn("Selecione uma categoria.");
        if (!formData.data_pagamento) return toast.warn("Informe a data do pagamento.");

        // Validação específica para salários
        if (formData.categoria === 'salarios' && !formData.id_professor) {
            return toast.warn("Para lançar salário, selecione o professor.");
        }

        setIsLoading(true);

        try {
            const payload = {
                id_professor: formData.id_professor ? Number(formData.id_professor) : null,
                valor: Number(formData.valor),
                categoria: formData.categoria,
                data_pagamento: formData.data_pagamento,
                mes_referencia: Number(formData.mes_referencia),
                ano_referencia: Number(formData.ano_referencia),
                descricao: formData.descricao,
            };

            await api.post("/despesa", payload);
            toast.success("Despesa lançada com sucesso!");

            // Se veio do perfil do professor, talvez queira voltar pra lá? 
            // Por padrão, vamos para a lista de lançamentos
            navigate("/lancamentos");

        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao salvar despesa.");
        } finally {
            setIsLoading(false);
        }
    };

    // Estilos padronizados
    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputClass = "w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-slate-400";

    return (
        <Container>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/lancamentos")}
                    className="pl-0 text-slate-500 hover:text-slate-800"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                </Button>
                <Title level={2} className="!mb-0">Nova Despesa</Title>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">

                {/* 1. DADOS FINANCEIROS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Detalhes do Pagamento</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Valor (R$) *</label>
                            <input
                                type="number"
                                name="valor"
                                value={formData.valor}
                                onChange={handleChange}
                                className={`${inputClass} text-lg font-bold text-red-600`}
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Data do Pagamento *</label>
                            <input
                                type="date"
                                name="data_pagamento"
                                value={formData.data_pagamento}
                                onChange={handleChange}
                                max={hoje}
                                className={inputClass}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Categoria da Despesa *</label>
                            <div className="relative">
                                <select
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10 bg-white`}
                                    required
                                >
                                    <option value="">Selecione a categoria...</option>
                                    {categorias.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. VÍNCULO E REFERÊNCIA */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Referência e Vínculo</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Mês</label>
                                <input
                                    type="number"
                                    name="mes_referencia"
                                    value={formData.mes_referencia}
                                    onChange={handleChange}
                                    className={inputClass}
                                    min="1" max="12"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Ano</label>
                                <input
                                    type="number"
                                    name="ano_referencia"
                                    value={formData.ano_referencia}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Vincular Professor (Opcional)</label>
                            <div className="relative">
                                <select
                                    name="id_professor"
                                    value={formData.id_professor}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10 bg-white`}
                                >
                                    <option value="">Sem vínculo</option>
                                    {professores.map((prof) => (
                                        <option key={prof.id} value={prof.id}>{prof.nome}</option>
                                    ))}
                                </select>
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">Selecione se for pagamento de salário.</p>
                        </div>
                    </div>
                </div>

                {/* 3. DESCRIÇÃO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Descrição (Gerada Automaticamente)</label>
                    </div>
                    <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="Detalhes da despesa..."
                    />
                </div>

                {/* BOTÕES */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/lancamentos")}
                        className="text-slate-500"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white min-w-[200px] h-12 shadow-lg shadow-red-200 border-none"
                    >
                        {isLoading ? "Salvando..." : (
                            <span className="flex items-center gap-2">
                                <Save className="w-5 h-5" /> Confirmar Despesa
                            </span>
                        )}
                    </Button>
                </div>

            </form>
        </Container>
    );
}