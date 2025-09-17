import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../components/Container";

export default function CadastroProfessor() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T"[0]);

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
            data_contratacao: formatarParaISO(data.data_matricula),
        };

        try {
            await api.post("/professores", payload);
            alert("Professor(a) cadastrado com sucesso!");
            navigate("/professores");
        } catch (error) {
            console.log(data);
            console.error("Erro ao cadastrar aluno:", error?.response?.data || error);
            alert("Erro ao cadastrar professor(a). Verifique os dados e tente novamente.");
        }
    };

    return (
        <Container>

        </Container>
    )

}