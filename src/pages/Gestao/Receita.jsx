import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import {
    ChevronLeftIcon,
    Save,
    Wallet,
    Calendar,
    FileText,
    User,
    DollarSign
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Função utilitária para data segura
function formatDateForInputSafe(dateISO) {
    if (!dateISO) return "";
    const [ano, mes, dia] = dateISO.split("T")[0].split("-");
    return `${ano}-${mes}-${dia}`;
}

export default function CadastroReceita() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Configuração Inicial de Datas
    const hojeISO = dayjs().format("YYYY-MM-DD");
    const mesAtual = dayjs().month() + 1;
    const anoAtual = dayjs().year();

    const [isLoading, setIsLoading] = useState(false);
    const [alunos, setAlunos] = useState([]);

    const [formData, setFormData] = useState({
        id_aluno: "",
        valor: "",
        data_pagamento: hojeISO,
        mes_referencia: mesAtual,
        ano_referencia: anoAtual,
        descricao: `Mensalidade referente a ${mesAtual.toString().padStart(2, '0')}/${anoAtual}`,
    });

    // 1. Carregar Alunos e Verificar URL
    useEffect(() => {
        async function carregarAlunos() {
            try {
                const res = await api.get("/alunos");

                // Ordenação Alfabética
                const listaOrdenada = res.data.sort((a, b) =>
                    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
                );

                setAlunos(listaOrdenada);

                // LÓGICA DE URL: Se vier da tela de detalhes (?alunoId=5)
                const alunoIdUrl = searchParams.get("alunoId");
                if (alunoIdUrl) {
                    const alunoEncontrado = listaOrdenada.find(a => String(a.id) === alunoIdUrl);
                    if (alunoEncontrado) {
                        setFormData(prev => ({
                            ...prev,
                            id_aluno: String(alunoEncontrado.id),
                            valor: alunoEncontrado.valor_mensalidade || ""
                        }));
                    }
                }

            } catch (error) {
                console.error("Erro:", error);
                toast.error("Erro ao carregar lista de alunos.");
            }
        }
        carregarAlunos();
    }, [searchParams]);

    // 2. Lógica de Alteração do Formulário
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Atualização do Estado
        setFormData(prev => {
            const newValues = { ...prev, [name]: value };

            // Se mudou o aluno, busca o valor da mensalidade dele
            if (name === 'id_aluno') {
                const alunoSelecionado = alunos.find(a => String(a.id) === String(value));
                if (alunoSelecionado) {
                    newValues.valor = alunoSelecionado.valor_mensalidade;
                }
            }

            // Se mudou mês ou ano, atualiza a descrição automática
            if (name === 'mes_referencia' || name === 'ano_referencia') {
                const mesFormatado = String(newValues.mes_referencia).padStart(2, '0');
                newValues.descricao = `Mensalidade referente a ${mesFormatado}/${newValues.ano_referencia}`;
            }

            return newValues;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação Simples
        if (!formData.id_aluno) return toast.warn("Selecione um aluno.");
        if (!formData.valor || Number(formData.valor) <= 0) return toast.warn("Informe um valor válido.");

        const payload = {
            id_aluno: Number(formData.id_aluno),
            valor: Number(formData.valor),
            data_pagamento: formatDateForInputSafe(formData.data_pagamento),
            mes_referencia: Number(formData.mes_referencia),
            ano_referencia: Number(formData.ano_referencia),
            descricao: formData.descricao,
        };

        try {
            setIsLoading(true);
            await api.post("/receitas", payload);
            toast.success("Pagamento registrado com sucesso! 💰");
            navigate("/lancamentos");

        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || "Erro ao salvar.";

            if (status === 409) {
                toast.warning(`Atenção: ${message}`);
            } else {
                console.error("Erro:", error);
                toast.error(`Erro: ${message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Estilos padronizados
    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputClass = "w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder:text-slate-400";

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
                <Title level={2} className="!mb-0">Registrar Receita</Title>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">

                {/* 1. ORIGEM DO RECURSO (ALUNO) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Aluno Pagante</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Selecione o Aluno *</label>
                            <div className="relative">
                                <select
                                    name="id_aluno"
                                    value={formData.id_aluno}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10 bg-white`}
                                    required
                                >
                                    <option value="">Selecione na lista...</option>
                                    {alunos.map(aluno => (
                                        <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                                    ))}
                                </select>
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DADOS DO PAGAMENTO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-700">Dados do Pagamento</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Valor Recebido (R$) *</label>
                            <input
                                type="number"
                                name="valor"
                                value={formData.valor}
                                onChange={handleChange}
                                className={`${inputClass} text-lg font-bold text-green-600`}
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
                                max={hojeISO}
                                className={inputClass}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <div>
                                <label className={labelClass}>Mês Referência</label>
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
                                <label className={labelClass}>Ano Referência</label>
                                <input
                                    type="number"
                                    name="ano_referencia"
                                    value={formData.ano_referencia}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. DESCRIÇÃO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Descrição (Automática)</label>
                    </div>
                    <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="Detalhes do recebimento..."
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
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[200px] h-12 shadow-lg shadow-green-200 border-none"
                    >
                        {isLoading ? "Salvando..." : (
                            <span className="flex items-center gap-2">
                                <Wallet className="w-5 h-5" /> Confirmar Recebimento
                            </span>
                        )}
                    </Button>
                </div>

            </form>
        </Container>
    );
}