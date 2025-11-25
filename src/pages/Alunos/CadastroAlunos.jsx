import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import { toast } from 'react-toastify';

// Função utilitária para máscara (pode mover para utils/masks.js depois)
const maskPhone = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "") // Remove tudo que não é dígito
        .replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses no DDD
        .replace(/(\d{5})(\d)/, "$1-$2") // Coloca o hífen depois do 5º dígito
        .replace(/(-\d{4})\d+?$/, "$1"); // Impede digitar mais que o necessário
};

export default function CadastroAlunos() {
    const navigate = useNavigate();
    const hoje = new Date().toLocaleDateString("en-CA");

    const [isLoading, setIsLoading] = useState(false); // <--- Trava do botão
    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        responsavel: "",
        telefone: "",
        data_matricula: hoje,
        valor_mensalidade: "",
        serie: "",
        turno: "",
        observacao: "",
        status: "ativo",
    });

    // Interceptador de Mudanças (Aqui aplicamos as máscaras)
    const handleFormChange = (newValues) => {
        // Se o telefone mudou, aplicamos a máscara
        if (newValues.telefone !== formData.telefone) {
            newValues.telefone = maskPhone(newValues.telefone);
        }
        setFormData(newValues);
    };

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
        {
            name: "telefone",
            label: "WhatsApp / Telefone",
            placeholder: "(99) 99999-9999",
            type: "tel", // Mantemos tel para mobile
            maxLength: 15, // Limita caracteres
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
        // 1. Validação Robusta
        const erros = [];

        if (!data.nome.trim()) erros.push("Nome é obrigatório");
        if (!data.responsavel.trim()) erros.push("Responsável é obrigatório");
        if (data.telefone.length < 14) erros.push("Telefone inválido (Preencha DDD + número)");
        if (!data.valor_mensalidade || Number(data.valor_mensalidade) < 0) erros.push("Valor da mensalidade inválido");
        if (!data.serie) erros.push("Selecione a série");
        if (!data.turno) erros.push("Selecione o turno");

        if (erros.length > 0) {
            erros.forEach(erro => toast.error(erro));
            return;
        }

        // 2. Preparação do Payload
        const payload = {
            ...data,
            // Garante que número vá como número (evita "150.00" string)
            valor_mensalidade: Number(data.valor_mensalidade),
            // Trim remove espaços acidentais no começo/fim
            nome: data.nome.trim(),
            responsavel: data.responsavel.trim(),
        };

        try {
            setIsLoading(true);
            await api.post("/alunos", payload);
            toast.success("Aluno cadastrado com sucesso! 🎉");

            const desejaNovo = window.confirm("Aluno cadastrado! Deseja cadastrar outro?");
            if (desejaNovo) {
                setFormData({ ...formData, nome: "", responsavel: "", telefone: "", valor_mensalidade: "" });
            } else {
                navigate("/alunos");
            }

        } catch (error) {
            console.error("Erro:", error);
            const msgErro = error.response?.data?.message || "Erro desconhecido ao salvar.";
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

            {/* Componente Genérico de Form */}
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