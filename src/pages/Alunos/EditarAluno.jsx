import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Container, Title } from "../../components/Container";
import { Form } from "../../components/Form";
import { ChevronLeftIcon } from "lucide-react";
import dayjs from "dayjs";
import { toast } from 'react-toastify';

// Função de máscara
const maskPhone = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
};

// Formata data ISO para input date
const formatToInputDate = (isoString) => {
    if (!isoString) return "";
    return dayjs(isoString).format("YYYY-MM-DD");
};

export function EditarAluno() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 1. ESTADO INICIAL ATUALIZADO (Inclui plano e email)
    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        responsavel: "",
        telefone: "",
        data_matricula: "",
        valor_mensalidade: "",
        serie: "",
        turno: "",
        observacao: "",
        status: "",
        plano: "basico",       // <--- Novo
        email_responsavel: ""  // <--- Novo
    });

    // 2. DEFINIÇÃO DOS CAMPOS (Agora dentro do componente para ser dinâmica)
    const fields = [
        { name: "nome", label: "Nome", type: "text" },
        {
            name: "data_nascimento",
            label: "Data de Nascimento",
            type: "date",
            disabled: true, // Geralmente não se muda data de nascimento fácil
        },
        { name: "responsavel", label: "Responsável", type: "text" },

        // --- BLOCO NOVO: PLANO E EMAIL ---
        {
            name: "plano",
            label: "Tipo de Plano (Acesso App)",
            type: "select",
            options: [
                { label: "Básico (Sem App)", value: "basico" },
                { label: "Premium (Com App)", value: "premium" },
            ],
        },
        // Condicional: Só mostra Email se for Premium
        ...(formData.plano === 'premium' ? [{
            name: "email_responsavel",
            label: "Email do Responsável (Login)",
            type: "email",
            placeholder: "email@exemplo.com",
            fullWidth: true
        }] : []),
        // ---------------------------------

        { name: "telefone", label: "Telefone", type: "tel", maxLength: 15 },
        { name: "data_matricula", label: "Data de Matrícula", type: "date" },
        {
            name: "valor_mensalidade",
            label: "Mensalidade",
            type: "number",
            step: "0.01",
            min: "0"
        },
        {
            name: "serie",
            label: "Série",
            type: "select",
            options: [
                { label: "Selecione a série", value: "" },
                { label: "Infantil III", value: "Infantil III" },
                { label: "Infantil IV", value: "Infantil IV" },
                { label: "Infantil V", value: "Infantil V" },
                { label: "Fundamental 1", value: "Fundamental1" },
                { label: "Fundamental 2", value: "Fundamental2" },
            ],
        },
        {
            name: "turno",
            label: "Turno",
            type: "select",
            options: [
                { label: "Selecione o turno", value: "" },
                { label: "Manhã", value: "Manhã" },
                { label: "Tarde", value: "Tarde" },
            ],
        },
        {
            name: "observacao",
            label: "Observações",
            type: "textarea",
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Ativo", value: "ativo" },
                { label: "Inativo", value: "inativo" },
            ],
        },
    ];

    // 3. BUSCA DE DADOS (Carrega o que vem do Backend)
    useEffect(() => {
        async function fetchAluno() {
            try {
                const { data } = await api.get(`/alunos/${id}`);

                setFormData({
                    ...data,
                    data_nascimento: formatToInputDate(data.data_nascimento),
                    data_matricula: formatToInputDate(data.data_matricula),
                    telefone: maskPhone(data.telefone || ""),
                    // Garante que o plano venha correto, se vier null assume basico
                    plano: data.plano || "basico",
                    email_responsavel: data.email_responsavel || ""
                });

            } catch (error) {
                console.error("Erro:", error);
                toast.error("Erro ao carregar dados do aluno.");
                navigate("/alunos");
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchAluno();
    }, [id, navigate]);

    const handleFormChange = (newValues) => {
        if (newValues.telefone !== formData.telefone) {
            newValues.telefone = maskPhone(newValues.telefone);
        }
        setFormData(newValues);
    };

    const handleSubmit = async (data) => {
        // Validação básica
        if (!data.nome || !data.responsavel) {
            toast.error("Por favor, preencha os campos obrigatórios.");
            return;
        }

        // 4. VALIDAÇÃO DO PREMIUM NA EDIÇÃO
        if (data.plano === 'premium' && !data.email_responsavel) {
            toast.error("Para mudar para Premium, o Email do Responsável é obrigatório!");
            return;
        }

        const payload = {
            ...data,
            valor_mensalidade: Number(data.valor_mensalidade),
            // Se for básico, limpamos o email do payload para garantir consistência
            email_responsavel: data.plano === 'basico' ? null : data.email_responsavel
        };

        try {
            setIsSaving(true);
            await api.put(`/alunos/${id}`, payload);
            toast.success("Dados atualizados com sucesso!");
            navigate("/alunos");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar alterações.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return <div className="text-center mt-10">Carregando dados...</div>;
    }

    return (
        <Container>
            <div className="flex justify-between items-center mb-6">
                <Button
                    onClick={() => navigate("/alunos")}
                    className="flex items-center gap-2"
                    disabled={isSaving}
                >
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </Button>

                <div className="text-center">
                    <Title level={1}>Editar Aluno</Title>
                    <p className="text-gray-500 text-sm">Matrícula #{id}</p>
                </div>

                <div className="w-20"></div>
            </div>

            <Form
                fields={fields}
                values={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />

            {isSaving && <p className="text-center text-blue-600 mt-4">Salvando...</p>}
        </Container>
    );
}