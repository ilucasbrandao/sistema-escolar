import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, TitleH1 } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import { formatarParaISO } from "../../utils/date";

export default function CadastroLancamento() {
    const navigate = useNavigate();
    const location = useLocation();
    const tipoInicial = location.state?.tipo || "entrada";
    const hoje = new Date().toISOString().split("T")[0];

    const [alunos, setAlunos] = useState([]);
    const [professores, setProfessores] = useState([]);

    const [formData, setFormData] = useState(() => ({
        tipo: tipoInicial,
        categoria: "",
        descricao: "",
        valor: "",
        data_pagamento: tipoInicial === "entrada" ? hoje : "",
        data_vencimento: tipoInicial === "saida" ? hoje : "",
        aluno_id: "",
        professor_id: "",
        status: tipoInicial === "entrada" ? "pago" : "pendente",
    }));

    useEffect(() => {
        async function carregarDados() {
            try {
                const [alunosRes, professoresRes] = await Promise.all([
                    api.get("/alunos"),
                    api.get("/professores"),
                ]);
                setAlunos(alunosRes.data);
                setProfessores(professoresRes.data);
            } catch (error) {
                console.error("Erro ao carregar alunos ou professores:", error.message);
            }
        }
        carregarDados();
    }, []);

    const categoriasEntrada = [
        { label: "Escolha a categoria", value: "" },
        { label: "Salário", value: "salario" },
        { label: "Mensalidade", value: "mensalidade" },
    ];

    const categoriasSaida = [
        { label: "Escolha a categoria", value: "" },
        { label: "Água, Luz, Internet", value: "manutencao" },
        { label: "Cartão de Crédito", value: "cartao" },
        { label: "Outros", value: "outros" },
    ];

    const campos = [
        {
            name: "tipo",
            label: "Tipo",
            type: "select",
            options: [
                { label: "Entrada", value: "entrada" },
                { label: "Saída", value: "saida" },
            ],
            disabled: !!location.state?.tipo,
        },
        {
            name: "categoria",
            label: "Categoria",
            type: "select",
            options: formData.tipo === "entrada" ? categoriasEntrada : categoriasSaida,
        },
        {
            name: "descricao",
            label: "Descrição",
            type: "textarea",
            placeholder: "Descrição do lançamento",
            fullWidth: true,
        },
        {
            name: "valor",
            label: "Valor",
            type: "number",
            placeholder: "Digite o valor",
            step: "0.01",
            min: "0",
        },
        {
            name: formData.tipo === "entrada" ? "data_pagamento" : "data_vencimento",
            label: formData.tipo === "entrada" ? "Data de Pagamento" : "Data de Vencimento",
            type: "date",
            value: formData.tipo === "entrada" ? formData.data_pagamento : formData.data_vencimento,
            max: hoje,
        },
        {
            name: "aluno_id",
            label: "Aluno",
            type: "select",
            options: [
                { label: "Selecionar aluno", value: "" },
                ...alunos.map((a) => ({ label: a.nome, value: a.id })),
            ],
        },
        {
            name: "professor_id",
            label: "Professor",
            type: "select",
            options: [
                { label: "Selecionar professor", value: "" },
                ...professores.map((p) => ({ label: p.nome, value: p.id })),
            ],
        },
    ];

    const handleSubmit = async () => {
        const valorNumerico = parseFloat(String(formData.valor).replace(",", "."));

        const payload = {
            tipo: formData.tipo,
            categoria: formData.categoria,
            descricao: formData.descricao,
            valor: isNaN(valorNumerico) ? 0 : valorNumerico,
            status: formData.tipo === "entrada" ? "pago" : "pendente",
            data_pagamento:
                formData.tipo === "entrada"
                    ? formatarParaISO(formData.data_pagamento)
                    : null,
            data_vencimento:
                formData.tipo === "saida"
                    ? formatarParaISO(formData.data_vencimento)
                    : null,
            aluno_id: formData.aluno_id || null,
            professor_id: formData.professor_id || null,
        };

        try {
            await api.post("/lancamentos", payload);
            alert("Lançamento cadastrado com sucesso!");
            navigate("/lancamentos");
        } catch (error) {
            console.error("Erro ao salvar lançamento:", error?.response?.data || error);
            alert("Erro ao salvar lançamento. Verifique os dados e tente novamente.");
        }
    };

    return (
        <Container>
            <Button
                onClick={() => navigate("/lancamentos")}
                className="mb-4 flex items-center gap-2"
            >
                <ChevronLeftIcon className="w-5 h-5" />
                Voltar
            </Button>

            <TitleH1>Cadastrar Lançamento</TitleH1>

            <Form
                fields={campos}
                values={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />
        </Container>
    );
}
