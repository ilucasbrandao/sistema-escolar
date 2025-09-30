import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import { formatarParaISO } from "../../utils/date";

export default function CadastroAlunos() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];

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

    const fields = [
        { name: "nome", label: "Nome", placeholder: "Nome do Aluno", type: "text" },
        {
            name: "data_nascimento",
            label: "Data de Nascimento",
            type: "date",
            max: hoje,
        },
        {
            name: "responsavel",
            label: "Responsável",
            placeholder: "Nome do responsável",
            type: "text",
        },
        {
            name: "telefone",
            label: "Telefone",
            placeholder: "(99) 99999-9999",
            type: "tel",
        },
        {
            name: "data_matricula",
            label: "Data de Matrícula",
            type: "date",
            max: hoje,
        },
        {
            name: "valor_mensalidade",
            label: "Mensalidade",
            type: "number",
            placeholder: "Digite o valor da mensalidade",
            step: "0.01", // permite casas decimais
            min: "0", // evita valores negativos
        },
        {
            name: "serie",
            label: "Série",
            type: "select",
            options: [
                { label: "Selecione a serie", value: "" },
                { label: "Infantil I", value: "Infantil I" },
                { label: "Infantil II", value: "Infantil II" },
                { label: "Fundamental", value: "Fundamental" },
            ],
        },
        {
            name: "turno",
            label: "Turno",
            type: "select",
            options: [
                { label: "Selecione o turno", value: "" },
                { label: "Manhã", value: "Manha" },
                { label: "Tarde", value: "Tarde" },
            ],
        },
        {
            name: "observacao",
            label: "Observação",
            placeholder: "Observações sobre o aluno",
            type: "textarea",
            fullWidth: true,
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "", value: "" },
                { label: "Ativo", value: "ativo" },
                { label: "Inativo", value: "inativo" },
            ],
        },
    ];

    const handleSubmit = async (data) => {
        const obrigatorios = [
            "nome",
            "data_nascimento",
            "responsavel",
            "data_matricula",
            "valor_mensalidade",
            "serie",
            "turno",
        ];

        for (let campo of obrigatorios) {
            if (!data[campo]) {
                alert(`Campo ${campo} é obrigatório.`);
                return;
            }
        }

        const payload = {
            ...data,
            data_nascimento: formatarParaISO(data.data_nascimento),
            data_matricula: formatarParaISO(data.data_matricula),
            valor_mensalidade:
                data.valor_mensalidade !== "" && data.valor_mensalidade !== null
                    ? Number(data.valor_mensalidade)
                    : null,
        };

        try {
            await api.post("/alunos", payload);
            alert("Aluno cadastrado com sucesso!");
            navigate("/alunos");
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error?.response?.data || error);
            alert("Erro ao cadastrar aluno. Verifique os dados e tente novamente.");
        }
    };

    return (
        <Container>
            <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/alunos")}
                className="mb-4 flex items-center gap-2"
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
                onChange={setFormData}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />
        </Container>
    );
}
