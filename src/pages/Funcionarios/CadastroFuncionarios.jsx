import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paragraph, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import { formatarDataLegivel, formatarParaISO } from "../../utils/date";
import api from "../../services/api";

import { Form } from "../../components/Form";

export default function CadastroProfessor() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];


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

    const fields = [
        { name: "nome", label: "Nome", placeholder: "Nome do Professor(a)", type: "text" },
        {
            name: "data_nascimento",
            label: "Data de Nascimento",
            type: "date",
            max: hoje,
        },
        {
            name: "telefone",
            label: "Telefone",
            placeholder: "(99) 99999-9999",
            type: "tel",
        },
        {
            name: "endereco",
            label: "Endereço",
            placeholder: "Rua, Número, Bairro",
            type: "text",
        },
        {
            name: "data_contratacao",
            label: "Data de Contratação",
            type: "date",
            max: hoje,
        },
        {
            name: "nivel_ensino",
            label: "Nível de Ensino",
            type: "select",
            options: [
                { label: "", value: "" },
                { label: "Infantil", value: "Infantil" },
                { label: "Fundamental", value: "Fundamental" },
            ],
        },
        {
            name: "turno",
            label: "Turno",
            type: "select",
            options: [
                { label: "", value: "" },
                { label: "Manhã", value: "Manha" },
                { label: "Tarde", value: "Tarde" },
            ],
        },
        {
            name: "salario",
            label: "Salário",
            type: "number",
            placeholder: "Digite o valor do salário",
            step: "0.01", // permite casas decimais
            min: "0",     // evita valores negativos
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
            "data_contratacao",
            "nivel_ensino",
            "salario",
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
            data_contratacao: formatarParaISO(data.data_contratacao),
        };

        try {
            await api.post("/professores", payload);
            alert("Professor(a) cadastrado com sucesso!");
            navigate("/professores");
        } catch (error) {
            console.log(data);
            console.error("Erro ao cadastrar professor:", error?.response?.data || error);
            alert("Erro ao cadastrar professor(a). Verifique os dados e tente novamente.");
        }
    };

    return (
        <Container>
            <Button
                onClick={() => navigate("/professores")}
                className="mb-4 flex items-center gap-2"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </Button>

            <Title level={1}>Cadastrar Professor(a)</Title>

            <Form
                fields={fields}
                onSubmit={handleSubmit}
                values={formData}
                onChange={setFormData}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />

        </Container>
    )

}