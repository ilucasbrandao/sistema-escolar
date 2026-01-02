import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
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

    // 1. ATUALIZAÇÃO NO ESTADO INICIAL
    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        responsavel: "",
        plano: "basico",
        email_responsavel: "",
        data_matricula: hoje,
        valor_mensalidade: "",
        serie: "",
        turno: "",
        observacao: "",
        status: "ativo",
    });

    const handleFormChange = (newValues) => {
        if (newValues.telefone !== formData.telefone) {
            newValues.telefone = maskPhone(newValues.telefone);
        }
        setFormData(newValues);
    };

    // 2. CAMPOS AGORA SÃO DINÂMICOS (Dependem do formData.plano)
    const fields = [
        { name: "nome", label: "Nome Completo", placeholder: "Ex: João da Silva", type: "text" },
        {
            name: "data_nascimento",
            label: "Data de Nascimento",
            type: "date",
            max: hoje,
        },
        {
            name: "responsavel",
            label: "Responsável Financeiro",
            placeholder: "Nome do pai/mãe",
            type: "text",
        },
        // --- NOVO BLOCO DE PLANOS E EMAIL ---
        {
            name: "plano",
            label: "Tipo de Plano (Acesso ao App)",
            type: "select",
            options: [
                { label: "Básico (Sem App)", value: "basico" },
                { label: "Premium (Com App)", value: "premium" },
            ],
        },
        // Renderização Condicional: Só mostra Email se for Premium
        ...(formData.plano === 'premium' ? [{
            name: "email_responsavel",
            label: "Email do Responsável (Para Login)",
            type: "email",
            placeholder: "email@exemplo.com",
            fullWidth: true,
        }] : []),
        // ------------------------------------
        {
            name: "telefone",
            label: "WhatsApp / Telefone",
            placeholder: "(99) 99999-9999",
            type: "tel",
            maxLength: 15,
        },
        {
            name: "data_matricula",
            label: "Data de Matrícula",
            type: "date",
            max: hoje,
        },
        {
            name: "valor_mensalidade",
            label: "Mensalidade (R$)",
            type: "number",
            placeholder: "0.00",
            step: "0.01",
            min: "0",
        },
        {
            name: "serie",
            label: "Série",
            type: "select",
            options: [
                { label: "Selecione a série", value: "" },
                { label: "Infantil III", value: "Infantil III" },
                { label: "Infantil IV", value: "Infantil IV" },
                { label: "Infantil V", value: "Infantil V" },
                { label: "Fundamental 1", value: "Fundamental1" },
                { label: "Fundamental 2", value: "Fundamental2" },
            ],
        },
        {
            name: "turno",
            label: "Turno",
            type: "select",
            options: [
                { label: "Selecione o turno", value: "" },
                { label: "Manhã", value: "Manhã" },
                { label: "Tarde", value: "Tarde" },
            ],
        },
        {
            name: "observacao",
            label: "Observação",
            placeholder: "Alergias, restrições, etc...",
            type: "textarea",
            fullWidth: true,
        },
    ];

    const handleSubmit = async (data) => {
        // 3. VALIDAÇÃO ATUALIZADA
        const erros = [];

        if (!data.nome.trim()) erros.push("Nome é obrigatório");
        if (!data.responsavel.trim()) erros.push("Responsável é obrigatório");

        // Validação específica do Premium
        if (data.plano === 'premium' && !data.email_responsavel.trim()) {
            erros.push("Para o plano Premium, o Email do Responsável é obrigatório!");
        }

        if (data.telefone.length < 11) erros.push("Telefone inválido");
        if (!data.valor_mensalidade || Number(data.valor_mensalidade) < 0) erros.push("Valor da mensalidade inválido");
        if (!data.serie) erros.push("Selecione a série");
        if (!data.turno) erros.push("Selecione o turno");

        if (erros.length > 0) {
            erros.forEach(erro => toast.error(erro));
            return;
        }

        const payload = {
            ...data,
            valor_mensalidade: Number(data.valor_mensalidade),
            nome: data.nome.trim(),
            responsavel: data.responsavel.trim(),
            // Se for básico, garantimos que não vai lixo no email
            email_responsavel: data.plano === 'basico' ? null : data.email_responsavel.trim()
        };

        try {
            setIsLoading(true);
            const response = await api.post("/alunos", payload);

            // Mensagem Personalizada
            if (response.data.acesso) {
                toast.success(`Aluno Cadastrado! Acesso Premium criado para: ${response.data.acesso.email}`);
                toast.info(`Senha provisória: Data de nascimento (apenas números)`);
            } else {
                toast.success("Aluno cadastrado com sucesso! (Plano Básico)");
            }

            const desejaNovo = window.confirm("Deseja cadastrar outro aluno?");
            if (desejaNovo) {
                setFormData({
                    ...formData,
                    nome: "",
                    responsavel: "",
                    email_responsavel: "",
                    telefone: "",
                    valor_mensalidade: ""
                });
            } else {
                navigate("/alunos");
            }

        } catch (error) {
            console.error("Erro:", error);
            const msgErro = error.response?.data?.message || error.response?.data?.error || "Erro desconhecido ao salvar.";
            toast.error(`Falha: ${msgErro}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/alunos")}
                className="mb-4 flex items-center gap-2"
                disabled={isLoading}
            >
                <ChevronLeftIcon className="w-5 h-5" />
                Voltar
            </Button>

            <Title level={1} className="text-center mb-8">
                Cadastrar Aluno
            </Title>

            <Form
                fields={fields}
                values={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3"
            />

            {isLoading && <p className="text-center text-blue-600 font-bold mt-2">Salvando dados...</p>}
        </Container>
    );
}