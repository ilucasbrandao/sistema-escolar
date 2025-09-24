import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TitleH1 } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import { formatarParaISO, formatarDataLegivel } from "../../utils/date";

export default function CadastroAlunos() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        responsavel: "",
        telefone: "",
        data_matricula: hoje,
        serie: "",
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
            name: "serie",
            label: "Série",
            type: "select",
            options: [
                { label: "", value: "" },
                { label: "Infantil I", value: "Infantil I" },
                { label: "Infantil II", value: "Infantil II" },
                { label: "Fundamental", value: "Fundamental" },
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
            "serie",
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
                onClick={() => navigate("/alunos")}
                className="mb-4 flex items-center gap-2"
            >
                <ChevronLeftIcon className="w-5 h-5" />
                Voltar
            </Button>

            <TitleH1>Cadastrar Aluno</TitleH1>

            <Form
                fields={fields}
                values={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />

            {/* Exemplo de exibição da data formatada */}
            {formData.data_nascimento && (
                <p className="mt-4 text-sm text-gray-600">
                    Data de nascimento formatada:{" "}
                    {formatarDataLegivel(formData.data_nascimento)}
                </p>
            )}
        </Container>
    );
}
