import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon, Dock } from "lucide-react";
import api from "../../services/api";
import { formatarParaISO } from "../../utils/date";
import dayjs from "dayjs";

// ✅ Função para formatar datas sem timezone
function formatDateForInputSafe(dateISO) {
    if (!dateISO) return "";
    const [ano, mes, dia] = dateISO.split("T")[0].split("-");
    return `${ano}-${mes}-${dia}`; // YYYY-MM-DD
}

export default function CadastroReceita() {
    const navigate = useNavigate();
    const hojeISO = dayjs().format("YYYY-MM-DD"); // para o input date
    const mesAtual = dayjs().month() + 1;
    const anoAtual = dayjs().year();

    const [alunos, setAlunos] = useState([]);
    const [formData, setFormData] = useState({
        id_aluno: "",
        valor: "",
        data_pagamento: hojeISO,
        mes_referencia: mesAtual,
        ano_referencia: anoAtual,
        descricao: `Mensalidade referente ao mês: ${mesAtual}/${anoAtual}`,
    });

    useEffect(() => {
        async function carregarAlunos() {
            try {
                const res = await api.get("/alunos");

                // Ordena por nome (case-insensitive)
                const alunosOrdenados = res.data.sort((a, b) =>
                    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
                );

                setAlunos(alunosOrdenados);
            } catch (error) {
                console.error("Erro ao carregar alunos:", error.message);
            }
        }
        carregarAlunos();
    }, []);

    // Atualiza descrição automaticamente quando mês ou ano mudam
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            descricao: `Mensalidade referente ao mês: ${prev.mes_referencia}/${prev.ano_referencia}`,
        }));
    }, [formData.mes_referencia, formData.ano_referencia]);

    const campos = [
        {
            name: "id_aluno",
            label: "Aluno",
            type: "select",
            options: [
                { label: "Selecionar aluno", value: "" },
                ...alunos.map((a) => ({ label: a.nome, value: String(a.id) })),
            ],
        },
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
            max: hojeISO,
            value: formatDateForInputSafe(formData.data_pagamento),
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
            id_aluno: Number(formData.id_aluno),
            valor: Number(formData.valor),
            data_pagamento: formatDateForInputSafe(formData.data_pagamento),
            mes_referencia: Number(formData.mes_referencia),
            ano_referencia: Number(formData.ano_referencia),
            descricao: formData.descricao,
        };

        try {
            await api.post("/receitas", payload);
            alert("✅ Receita lançada com sucesso!");
            navigate("/lancamentos");
        } catch (error) {
            const status = error.response?.status;
            const message =
                error.response?.data?.message || "Erro ao salvar receita.";

            if (status === 409) {
                // 🚫 Já existe lançamento no mesmo mês/ano
                alert(`⚠️ ${message}`);
            } else if (status === 400) {
                // Erros de validação (ex: campos vazios)
                alert(`❌ ${message}`);
            } else {
                console.error("Erro ao salvar Receita:", error);
                alert("❌ Ocorreu um erro inesperado. Tente novamente.");
            }
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

            <Title className="text-center" level={1}>
                Lançar Receita
            </Title>

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
