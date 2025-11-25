import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Form } from "../../components/Form";
import { Button } from "../../components/Button";
import { ChevronLeftIcon, Dock } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Função utilitária para data segura
function formatDateForInputSafe(dateISO) {
    if (!dateISO) return "";
    const [ano, mes, dia] = dateISO.split("T")[0].split("-");
    return `${ano}-${mes}-${dia}`;
}

export default function CadastroReceita() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Hook para pegar parametros da URL (?alunoId=10)

    // Configuração Inicial de Datas
    const hojeISO = dayjs().format("YYYY-MM-DD");
    const mesAtual = dayjs().month() + 1;
    const anoAtual = dayjs().year();

    const [isLoading, setIsLoading] = useState(false);
    const [alunos, setAlunos] = useState([]);

    const [formData, setFormData] = useState({
        id_aluno: "",
        valor: "",
        data_pagamento: hojeISO,
        mes_referencia: mesAtual,
        ano_referencia: anoAtual,
        descricao: `Mensalidade referente a ${mesAtual.toString().padStart(2, '0')}/${anoAtual}`,
    });

    // 1. Carregar Alunos e Verificar URL
    useEffect(() => {
        async function carregarAlunos() {
            try {
                const res = await api.get("/alunos");

                // Ordenação Alfabética Segura
                const listaOrdenada = res.data.sort((a, b) =>
                    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
                );

                setAlunos(listaOrdenada);

                // LÓGICA DE URL: Se vier da tela de detalhes (?alunoId=5)
                const alunoIdUrl = searchParams.get("alunoId");
                if (alunoIdUrl) {
                    const alunoEncontrado = listaOrdenada.find(a => String(a.id) === alunoIdUrl);
                    if (alunoEncontrado) {
                        setFormData(prev => ({
                            ...prev,
                            id_aluno: String(alunoEncontrado.id),
                            valor: alunoEncontrado.valor_mensalidade || "" // Já preenche o valor!
                        }));
                    }
                }

            } catch (error) {
                console.error("Erro:", error);
                toast.error("Erro ao carregar lista de alunos.");
            }
        }
        carregarAlunos();
    }, [searchParams]);

    const handleFormChange = (newValues) => {
        // Se o ID do aluno mudou, vamos procurar o valor correto
        if (newValues.id_aluno !== formData.id_aluno) {
            const alunoSelecionado = alunos.find(a => String(a.id) === String(newValues.id_aluno));

            if (alunoSelecionado) {
                // Atualiza o valor automaticamente
                newValues.valor = alunoSelecionado.valor_mensalidade;
            }
        }

        if (newValues.mes_referencia !== formData.mes_referencia || newValues.ano_referencia !== formData.ano_referencia) {
            const mesFormatado = String(newValues.mes_referencia).padStart(2, '0');
            newValues.descricao = `Mensalidade referente a ${mesFormatado}/${newValues.ano_referencia}`;
        }

        setFormData(newValues);
    };

    const campos = [
        {
            name: "id_aluno",
            label: "Selecione o Aluno",
            type: "select",
            options: [
                { label: "Selecione...", value: "" },
                ...alunos.map((a) => ({ label: a.nome, value: String(a.id) })),
            ],
        },
        {
            name: "valor",
            label: "Valor Recebido (R$)",
            type: "number",
            placeholder: "0.00",
            step: "0.01",
            min: "0",
        },
        {
            name: "data_pagamento",
            label: "Data do Pagamento",
            type: "date",
            max: hojeISO,
        },
        {
            name: "mes_referencia",
            label: "Mês Referência",
            type: "number",
            min: 1,
            max: 12,
        },
        {
            name: "ano_referencia",
            label: "Ano Referência",
            type: "number",
            min: 2020,
            max: 2030,
        },
        {
            name: "descricao",
            label: "Descrição do Lançamento",
            type: "text",
            placeholder: "Descrição automática...",
        },
    ];

    const handleSubmit = async () => {
        // Validação Simples
        if (!formData.id_aluno || !formData.valor) {
            toast.warning("Selecione um aluno e verifique o valor.");
            return;
        }

        const payload = {
            id_aluno: Number(formData.id_aluno),
            valor: Number(formData.valor),
            data_pagamento: formatDateForInputSafe(formData.data_pagamento),
            mes_referencia: Number(formData.mes_referencia),
            ano_referencia: Number(formData.ano_referencia),
            descricao: formData.descricao,
        };

        try {
            setIsLoading(true);
            await api.post("/receitas", payload);
            toast.success("Pagamento registrado com sucesso! 💰");
            navigate("/lancamentos");

        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || "Erro ao salvar.";

            if (status === 409) {
                toast.warning(`Atenção: ${message}`);
            } else {
                console.error("Erro:", error);
                toast.error(`Erro: ${message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Button
                onClick={() => navigate("/lancamentos")}
                className="mb-4 flex items-center gap-2"
                disabled={isLoading}
            >
                <Dock className="w-5 h-5" />
                Ver Lançamentos
            </Button>

            <Title className="text-center mb-6" level={1}>
                Registrar Receita
            </Title>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Form
                    fields={campos}
                    values={formData}
                    onChange={handleFormChange}
                    onSubmit={handleSubmit}
                    className="w-full"
                />
            </div>

            {isLoading && <p className="text-center text-sm text-gray-500 mt-4 animate-pulse">Processando pagamento...</p>}
        </Container>
    );
}