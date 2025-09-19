import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, TitleH1 } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import { formatarParaISO } from "../../utils/date";

export default function CadastroLancamento() {
    const navigate = useNavigate();
    const { id } = useParams(); // para edição
    const location = useLocation();
    const tipoInicial = location.state?.tipo || "entrada";
    const hoje = new Date().toISOString().split("T")[0];

    const [alunos, setAlunos] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [formData, setFormData] = useState({
        tipo: tipoInicial,
        categoria: "",
        descricao: "",
        valor: "",
        data_vencimento: hoje,
        data_pagamento: tipoInicial === "entrada" ? hoje : "",
        aluno_id: "",
        professor_id: "",
        status: tipoInicial === "entrada" ? "pago" : "pendente",
    });

    // Carregar alunos e professores
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

    // Carregar lançamento para edição
    useEffect(() => {
        if (!id) return;
        async function carregarLancamento() {
            try {
                const { data } = await api.get(`/lancamentos/${id}`);
                setFormData({
                    tipo: data.tipo,
                    categoria: data.categoria,
                    descricao: data.descricao,
                    valor: data.valor,
                    data_vencimento: data.data_vencimento,
                    data_pagamento: data.data_pagamento || "",
                    aluno_id: data.aluno_id || "",
                    professor_id: data.professor_id || "",
                    status: data.status || "pendente",
                });
            } catch (error) {
                console.error("Erro ao carregar lançamento:", error.message);
            }
        }
        carregarLancamento();
    }, [id]);

    // Categorias pré-definidas
    const categoriasEntrada = [
        { label: "Salário", value: "salario" },
        { label: "Mensalidade", value: "mensalidade" },
    ];

    const categoriasSaida = [
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
            options:
                formData.tipo === "entrada" ? categoriasEntrada : categoriasSaida,
        },
        {
            name: "descricao",
            label: "Descrição",
            placeholder: "Descrição do lançamento",
            type: "textarea",
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
            max: hoje,
            value:
                formData.tipo === "entrada"
                    ? formData.data_pagamento || hoje
                    : formData.data_vencimento,
            onChange: (e) => {
                if (formData.tipo === "entrada") {
                    setFormData({ ...formData, data_pagamento: e.target.value });
                } else {
                    setFormData({ ...formData, data_vencimento: e.target.value });
                }
            },
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
        const payload = {
            ...formData,
            valor: parseFloat(formData.valor) || 0, // tenta converter, se falhar usa 0
            status: formData.tipo === "entrada" ? "pago" : "pendente",
            data_pagamento:
                formData.tipo === "entrada"
                    ? formatarParaISO(formData.data_pagamento)
                    : null,
            data_vencimento:
                formData.tipo === "saida"
                    ? formatarParaISO(formData.data_vencimento)
                    : formatarParaISO(formData.data_vencimento),
        };

        try {
            if (id) {
                await api.put(`/lancamentos/${id}`, payload);
                alert("Lançamento atualizado com sucesso!");
            } else {
                await api.post("/lancamentos", payload);
                alert("Lançamento cadastrado com sucesso!");
            }
            navigate("/gestao-financeira");
        } catch (error) {
            console.error("Erro ao salvar lançamento:", error?.response?.data || error);
            alert("Erro ao salvar lançamento. Verifique os dados e tente novamente.");
        }
    };


    return (
        <Container>
            <Button
                onClick={() => navigate("/gestao-financeira")}
                className="mb-4 flex items-center gap-2"
            >
                <ChevronLeftIcon className="w-5 h-5" />
                Voltar
            </Button>

            <TitleH1>{id ? "Editar Lançamento" : "Cadastrar Lançamento"}</TitleH1>

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
