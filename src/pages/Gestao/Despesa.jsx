import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { Form } from "../../components/Form";
import { Dock } from "lucide-react";
import api from "../../services/api";

// ✅ Função para formatar datas sem timezone
function formatDateForInputSafe(dateISO) {
    if (!dateISO) return "";
    const [ano, mes, dia] = dateISO.split("T")[0].split("-");
    return `${ano}-${mes}-${dia}`; // YYYY-MM-DD
}

export default function CadastroDespesa() {
    const navigate = useNavigate();
    const hoje = dayjs().format("YYYY-MM-DD");
    const mesAtual = dayjs().month() + 1;
    const anoAtual = dayjs().year();

    const [professor, setProfessor] = useState([]);
    const [formData, setFormData] = useState({
        id_professor: "",
        valor: "",
        data_pagamento: hoje,
        mes_referencia: mesAtual,
        ano_referencia: anoAtual,
        descricao: `Despesa referente ao mês: ${mesAtual}/${anoAtual}`,
    });

    useEffect(() => {
        async function carregarProfessores() {
            try {
                const res = await api.get("/professores");
                setProfessor(res.data);
            } catch (error) {
                console.error("Erro ao carregar professores:", error.message);
            }
        }
        carregarProfessores();
    }, []);

    // Atualiza descrição automaticamente quando mês ou ano mudam
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            descricao: `Despesa referente ao mês: ${prev.mes_referencia}/${prev.ano_referencia}`,
        }));
    }, [formData.mes_referencia, formData.ano_referencia])

    const campos = [
        {
            name: "id_professor",
            label: "Professor",
            type: "select",
            options: [
                { label: "Selecionar professor", value: "" },
                ...professor.map((a) => ({ label: a.nome, value: String(a.id) })),
            ],
        },
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
        {
            name: "descricao",
            label: "Descrição",
            type: "text",
            placeholder: "Digite a descrição",
        },
    ];

    const handleSubmit = async () => {
        const payload = {
            id_professor: Number(formData.id_professor),
            valor: Number(formData.valor),
            data_pagamento: formatDateForInputSafe(formData.data_pagamento),
            mes_referencia: Number(formData.mes_referencia),
            ano_referencia: Number(formData.ano_referencia),
            descricao: formData.descricao,
        };

        try {
            await api.post("/despesa", payload);
            alert("Despesa lançada com sucesso!");
            navigate("/lancamentos");
        } catch (error) {
            console.error("Erro ao salvar Despesa:", error?.response?.data || error);
            alert("Erro ao salvar. Verifique os dados e tente novamente.");
        }
    };

    return (
        <Container>
            <Button
                onClick={() => navigate("/lancamentos")}
                className="mb-4 flex items-center gap-2"
            >
                <Dock className="w-5 h-5" />
                Lançamentos
            </Button>

            <Title className="text-center" level={1}>Lançar Despesa</Title>

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
