import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import { ChevronLeftIcon } from "lucide-react";
import { Form } from "../../components/Form";
import dayjs from "dayjs";

// Função para converter DD/MM/YYYY → ISO
function formatDateForInputSafe(dateISO) {
    if (!dateISO) return "";
    const [ano, mes, dia] = dateISO.split("T")[0].split("-");
    return `${ano}-${mes}-${dia}`; // YYYY-MM-DD
}


// Remove formatação monetária e converte para número
function parseMensalidade(valor) {
    if (typeof valor === "string") {
        return parseFloat(
            valor.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
        );
    }
    return valor;
}

// Função para converter ISO → YYYY-MM-DD (para input type="date")
function formatDateForInput(dateISO) {
    return dayjs(dateISO).format("YYYY-MM-DD");
}

export function EditarAluno() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAluno() {
            try {
                const { data } = await api.get(`/alunos/${id}`);

                setFields([
                    { name: "nome", label: "Nome", type: "text", value: data.nome },
                    {
                        name: "data_nascimento",
                        label: "Data de Nascimento",
                        type: "date",
                        value: formatDateForInputSafe(data.data_nascimento),
                        disabled: true,
                    },
                    {
                        name: "responsavel",
                        label: "Responsável",
                        type: "text",
                        value: data.responsavel,
                    },
                    {
                        name: "telefone",
                        label: "Telefone",
                        type: "tel",
                        value: data.telefone,
                    },
                    {
                        name: "data_matricula",
                        label: "Data de Matrícula",
                        type: "date",
                        value: formatDateForInputSafe(data.data_matricula),
                    },
                    {
                        name: "valor_mensalidade",
                        label: "Mensalidade",
                        type: "number",
                        value: data.valor_mensalidade,
                        step: "0.01",
                        min: "0",
                    },
                    {
                        name: "serie",
                        label: "Série",
                        type: "select",
                        value: data.serie,
                        options: [
                            { label: "Infantil III", value: "Infantil III" },
                            { label: "Infantil IV", value: "Infantil IV" },
                            { label: "Infantil V", value: "Infantil V" },
                            { label: "Fundamental 1", value: "Fundamental1" },
                            { label: "Fundamental 2", value: "Fundamental2" }
                        ],
                    },
                    {
                        name: "turno",
                        label: "Turno",
                        type: "select",
                        value: data.turno,
                        options: [
                            { label: "", value: "" },
                            { label: "Manhã", value: "Manha" },
                            { label: "Tarde", value: "Tarde" },
                        ],
                    },
                    {
                        name: "observacao",
                        label: "Observações",
                        type: "textarea",
                        value: data.observacao,
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        options: [
                            { label: "Ativo", value: "ativo" },
                            { label: "Inativo", value: "inativo" },
                        ],
                        value: data.status,
                    },
                ]);
            } catch (error) {
                console.error("Erro ao carregar aluno:", error.message);
                alert("Erro ao carregar dados do aluno.");
            } finally {
                setLoading(false);
            }
        }

        fetchAluno();
    }, [id]);

    async function handleSubmit(formData) {
        const payload = {
            nome: formData.nome,
            data_nascimento: formData.data_nascimento,
            responsavel: formData.responsavel,
            telefone: formData.telefone,
            data_matricula: formData.data_matricula,
            valor_mensalidade: parseFloat(formData.valor_mensalidade),
            serie: formData.serie,
            observacao: formData.observacao,
            status: formData.status,
        };

        try {
            console.log(payload);
            await api.put(`/alunos/${id}`, payload);
            alert("Aluno atualizado com sucesso!");
            navigate("/alunos");
        } catch (error) {
            console.error(
                "Erro ao atualizar aluno:",
                error.response?.data || error.message
            );
            alert("Erro ao atualizar aluno.");
        }
    }

    if (loading) return <p className="text-center mt-6">Carregando dados...</p>;

    return (
        <Container>
            <Button
                onClick={() => navigate("/alunos")}
                className="mb-4 flex items-center gap-2"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <div className="text-center">
                <Title level={1}>Editar Aluno</Title>
                <Title level={3}>Mat: {id}</Title>
            </div>
            <Form
                fields={fields}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />
        </Container>
    );
}
