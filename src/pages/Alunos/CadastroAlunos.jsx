import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TitleH1 } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";

export default function CadastroAlunos() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        name: "",
        dataNascimento: "",
        responsavel: "",
        telefone: "",
        dataMatricula: hoje,
        serie: "",
        observacao: "",
        situacao: "ativo",
    });

    const fields = [
        { name: "name", label: "Nome", placeholder: "Nome do Aluno", type: "text" },
        { name: "dataNascimento", label: "Data de Nascimento", type: "date", max: hoje },
        { name: "responsavel", label: "Responsável", placeholder: "Nome do responsável", type: "text" },
        { name: "telefone", label: "Telefone", placeholder: "(99) 99999-9999", type: "tel" },
        { name: "dataMatricula", label: "Data de Matrícula", type: "date", max: hoje },
        {
            name: "serie", label: "Série", type: "select", options: [
                { label: "", value: "" },
                { label: "Infantil I", value: "Infantil I" },
                { label: "Infantil II", value: "Infantil II" },
                { label: "Fundamental", value: "Fundamental" },
            ]
        },
        { name: "observacao", label: "Observação", placeholder: "Observações sobre o aluno", type: "textarea", fullWidth: true },
        {
            name: "situacao", label: "Status", type: "select", options: [
                { label: "", value: "" },
                { label: "Ativo", value: "ativo" },
                { label: "Inativo", value: "inativo" },
            ]
        },
    ];

    const handleSubmit = async (data) => {
        // ✅ Validação de campos obrigatórios
        const obrigatorios = ["name", "dataNascimento", "responsavel", "dataMatricula", "serie"];
        for (let campo of obrigatorios) {
            if (!data[campo]) {
                alert(`Campo ${campo} é obrigatório.`);
                return;
            }
        }

        try {
            console.log("📤 Enviando para API:", data);
            const response = await api.post("/alunos", data);
            console.log("✅ Resposta da API:", response.data);
            alert("Aluno cadastrado com sucesso!");
            navigate("/alunos");
        } catch (error) {
            console.error("❌ Erro ao cadastrar aluno:", error?.response?.data || error);
            alert("Erro ao cadastrar aluno. Verifique os dados e tente novamente.");
        }
    };

    return (
        <Container>
            <Button onClick={() => navigate("/alunos")} className="mb-4 flex items-center gap-2">
                <ChevronLeftIcon className="w-5 h-5" />
            </Button>

            <TitleH1>Cadastrar Aluno</TitleH1>

            <Form fields={fields} onSubmit={handleSubmit} className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base" />
        </Container>
    );
}
