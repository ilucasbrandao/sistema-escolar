import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TitleH1 } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";

export default function CadastroAlunos() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        dataNascimento: "",
        responsavel: "",
        telefone: "",
        dataMatricula: "",
        serie: "",
        observacao: "",
        status: "ativo",
    });

    const fields = [
        { name: "name", label: "Nome", placeholder: "Nome do Aluno", type: "text" },
        { name: "dataNascimento", label: "Data de Nascimento", type: "date" },
        { name: "responsavel", label: "Responsável", placeholder: "Nome do responsável", type: "text" },
        { name: "telefone", label: "Telefone", placeholder: "(99) 99999-9999", type: "tel" },
        { name: "dataMatricula", label: "Data de Matrícula", type: "date" },
        {
            name: "serie", label: "Série", type: "select", options: [
                { label: "", value: "" },
                { label: "Infantil I", value: "Infantil I" },
                { label: "Infantil II", value: "Infantil II" },
                { label: "Fundamental", value: "Fundamental" },
            ]
        },
        {
            name: "observacao", label: "Observação", placeholder: "Observações sobre o aluno", type: "textarea", fullWidth: true
        },
        {
            name: "status", label: "Status", type: "select", options: [
                { label: "", value: "" },
                { label: "Ativo", value: "ativo" },
                { label: "Inativo", value: "inativo" },
            ]
        },
    ];

    const formatDateToDDMMYYYY = (dateStr) => {
        const date = new Date(dateStr);
        const dia = String(date.getDate()).padStart(2, "0");
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const handleSubmit = async (data) => {
        try {
            const hoje = new Date();
            const hojeISO = hoje.toISOString().split("T")[0];

            if (!data.name || !data.dataNascimento || !data.dataMatricula || !data.serie || !data.responsavel) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            if (data.dataMatricula > hojeISO) {
                alert("A data de matrícula não pode ser futura.");
                return;
            }

            const payload = {
                ...data,
                dataNascimento: formatDateToDDMMYYYY(data.dataNascimento),
                dataMatricula: formatDateToDDMMYYYY(data.dataMatricula),
            };

            console.log("📦 Enviando dados:", payload);

            const response = await api.post("/alunos", payload);
            console.log("✅ Resposta da API:", response);

            alert("Aluno cadastrado com sucesso!");
            navigate("/alunos");
        } catch (error) {
            alert("Erro ao cadastrar aluno. Verifique os dados e tente novamente.");
            console.error("❌ Erro ao cadastrar aluno:", error?.response?.data?.error || error?.message || error);
        }
    };

    return (
        <Container>
            <Button onClick={() => navigate("/alunos")} className="mb-4 flex items-center gap-2">
                <ChevronLeftIcon className="w-5 h-5" />
            </Button>

            <TitleH1>Cadastrar Aluno</TitleH1>

            <Form
                fields={fields}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />
        </Container>
    );
}
