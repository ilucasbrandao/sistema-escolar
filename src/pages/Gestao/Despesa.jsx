import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatarParaISO } from "../../utils/date";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { Form } from "../../components/Form";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";

export default function CadastroDespesa() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];

    const [professor, setProfessor] = useState([]);
    const [formData, setFormData] = useState({
        id_professor: "",
        valor: "",
        data_pagamento: hoje,
        mes_referencia: new Date().getMonth() + 1,
        ano_referencia: new Date().getFullYear(),
    });

    useEffect(() => {
        async function carregarProfessores() {
            try {
                const res = await api.get("/professores");
                setProfessor(res.data)
            } catch (error) {
                console.error("Erro ao carregar professores:", error.message);
            }

        }
        carregarProfessores();
    }, []);

    const campos = [
        {
            name: "id_professor",
            label: "Professor",
            type: "select",
            options: [
                { label: "Selecionar professor", value: "" },
                ...professor.map((a) => ({ label: a.nome, value: String(a.id) })),
            ],
        }
        ,
        {
            name: "valor",
            label: "Valor",
            type: "number",
            placeholder: "Digite o valor da despesa",
            step: "0.01",
            min: "0",
        },
        {
            name: "data_pagamento",
            label: "Data de Pagamento",
            type: "date",
            max: hoje,
        },
        {
            name: "mes_referencia",
            label: "Mês de Referência",
            type: "number",
            min: 1,
            max: 12,
        },
        {
            name: "ano_referencia",
            label: "Ano de Referência",
            type: "number",
            min: 2000,
            max: 2100,
        },
    ];

    const handleSubmit = async () => {
        const payload = {
            id_professor: Number(formData.id_professor),
            valor: Number(formData.valor),
            data_pagamento: formatarParaISO(formData.data_pagamento),
            mes_referencia: Number(formData.mes_referencia),
            ano_referencia: Number(formData.ano_referencia)
        }
        try {
            console.log("Payload enviado:", payload)
            await api.post("/despesa", payload);
            alert("Despesa lançada com sucesso!")
            navigate("/lancamentos");
        } catch (error) {
            console.error("Erro ao salvar Despesa:", error?.response?.data || error);
            alert("Erro ao salvar. Verifique os dados e tente novamente.")
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

            <Title level={1}>Lançar Despesa</Title>

            <Form
                fields={campos}
                values={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />
        </Container>
    )
}