import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";
import { formatarParaISO } from "../../utils/date";

export default function CadastroMensalidade() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];

    const [alunos, setAlunos] = useState([]);
    const [formData, setFormData] = useState({
        id_aluno: "",
        valor: "",
        data_pagamento: hoje,
        mes_referencia: new Date().getMonth() + 1,
        ano_referencia: new Date().getFullYear(),
    });

    useEffect(() => {
        async function carregarAlunos() {
            try {
                const res = await api.get("/alunos");
                setAlunos(res.data);
            } catch (error) {
                console.error("Erro ao carregar alunos:", error.message);
            }
        }
        carregarAlunos();
    }, []);

    const campos = [
        {
            name: "id_aluno",
            label: "Aluno",
            type: "select",
            options: [
                { label: "Selecionar aluno", value: "" },
                ...alunos.map((a) => ({ label: a.nome, value: String(a.id) })),
            ],
        }
        ,
        {
            name: "valor",
            label: "Valor",
            type: "number",
            placeholder: "Digite o valor da mensalidade",
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
        const idAlunoNumerico = Number(formData.id_aluno);
        const valorNumerico = Number(String(formData.valor).replace(",", "."));



        const payload = {
            id_aluno: Number(formData.id_aluno),
            valor: Number(formData.valor),
            data_pagamento: formatarParaISO(formData.data_pagamento),
            mes_referencia: Number(formData.mes_referencia),
            ano_referencia: Number(formData.ano_referencia),
        };




        try {
            console.log("Payload enviado:", payload);
            await api.post("/mensalidades", payload);
            alert("Mensalidade lançada com sucesso!");
            navigate("/lancamentos");
        } catch (error) {
            console.error("Erro ao salvar mensalidade:", error?.response?.data || error);
            alert("Erro ao salvar. Verifique os dados e tente novamente.");
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

            <Title level={1}>Lançar Mensalidade</Title>

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
