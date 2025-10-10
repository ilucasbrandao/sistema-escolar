import dayjs from "dayjs";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import { Form } from "../../components/Form";

// Função para converter DD/MM/YYYY → ISO
function formatDateForInputSafe(dateISO) {
    if (!dateISO) return "";
    const [ano, mes, dia] = dateISO.split("T")[0].split("-");
    return `${ano}-${mes}-${dia}`; // YYYY-MM-DD
}

export function EditarFuncionario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeacher() {
            try {
                const { data } = await api.get(`/professores/${id}`);
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
                        name: "telefone",
                        label: "Telefone",
                        type: "tel",
                        value: data.telefone,
                    },
                    {
                        name: "endereco",
                        label: "Endereço",
                        type: "text",
                        value: data.endereco,
                    },
                    {
                        name: "data_contratacao",
                        label: "Data de Contratação",
                        type: "date",
                        value: formatDateForInputSafe(data.data_contratacao),
                    },
                    {
                        name: "nivel_ensino",
                        label: "Nível de Ensino",
                        type: "select",
                        options: [
                            { label: "Infantil I", value: "Infantil" },
                            { label: "Fundamental", value: "Fundamental" },
                        ],
                        value: data.nivel_ensino,
                    },
                    {
                        name: "turno",
                        label: "Turno",
                        type: "select",
                        value: data.turno,
                        options: [
                            { label: "", value: "" },
                            { label: "Manhã", value: "Manhã" },
                            { label: "Tarde", value: "Tarde" },
                        ],
                    },
                    {
                        name: "salario",
                        label: "Salário",
                        type: "number",
                        value: (data.salario),
                        step: "0.01",
                        min: "0",
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
                console.error("Erro ao carregar professor(a)", error.message);
                alert("Erro ao carregar dados do professor(a)");
            } finally {
                setLoading(false);
            }
        }
        fetchTeacher();
    }, [id]);

    async function handleSubmit(formData) {
        const payload = {
            nome: formData.nome,
            data_nascimento: formData.data_nascimento,
            telefone: formData.telefone,
            endereco: formData.endereco,
            data_contratacao: formData.data_contratacao,
            nivel_ensino: formData.nivel_ensino,
            turno: formData.turno,
            salario: parseFloat(formData.salario),
            status: formData.status,
        };

        try {
            await api.put(`/professores/${id}`, payload);
            alert("Professor(a) atualizado com sucesso!");
            navigate("/professores");
        } catch (error) {
            console.error("Erro ao atualizar professor(a)", error.response?.data || error.message);
            alert("Erro ao atualizar professor(a)");
        }
    }

    if (loading) return <p className="text-center mt-6">Carregando dados...</p>;

    return (
        <Container>
            {/* Botão voltar */}
            <div className="mb-4 flex justify-start">
                <Button onClick={() => navigate("/professores")} className="flex items-center gap-2">
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span className="text-sm">Voltar</span>
                </Button>
            </div>

            {/* Título */}
            <div className="mb-6 text-center">
                <Title level={1} className="text-xl font-bold text-slate-800">Editar Professor(a)</Title>
                <p className="text-sm text-slate-600 mt-1">Matrícula: {id}</p>
            </div>

            {/* Formulário */}
            <div className="max-w-2xl mx-auto">
                <Form
                    fields={fields}
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
                />
            </div>
        </Container>

    );
}
