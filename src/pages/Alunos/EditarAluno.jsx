import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, TitleH1, TitleH3 } from "../../components/Container";
import { ChevronLeftIcon } from "lucide-react";
import { Form } from "../../components/Form";

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
                    { name: "name", label: "Nome", type: "text", value: data.name },
                    { name: "dataNascimento", label: "Data de Nascimento", type: "text", value: data.dataNascimento },
                    { name: "responsavel", label: "Responsável", type: "text", value: data.responsavel },
                    { name: "telefone", label: "Telefone", type: "text", value: data.telefone },
                    { name: "dataMatricula", label: "Data de Matrícula", type: "text", value: data.dataMatricula },
                    { name: "serie", label: "Série", type: "text", value: data.serie },
                    { name: "observacao", label: "Observações", type: "textarea", value: data.observacao },
                    {
                        name: "situacao",
                        label: "Situação",
                        type: "select",
                        options: [
                            { label: "Ativo", value: "ativo" },
                            { label: "Inativo", value: "inativo" },
                        ],
                        value: data.situacao,
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
        try {
            await api.put(`/alunos/${id}`, formData);
            alert("Aluno atualizado com sucesso!");
            navigate("/alunos");
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error.message);
            alert("Erro ao atualizar aluno.");
        }
    }

    if (loading) return <p className="text-center mt-6">Carregando dados...</p>;

    return (
        <Container>
            <Button onClick={() => navigate("/alunos")} className="mb-4 flex items-center gap-2">
                <ChevronLeftIcon className="w-5 h-5" />
            </Button>

            <TitleH1>Editar Aluno</TitleH1>
            <TitleH3>Mat: {id}</TitleH3>

            <Form
                fields={fields}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />
        </Container>
    );
}
