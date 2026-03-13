import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export function useCadastroAluno() {
  const navigate = useNavigate();
  const hoje = dayjs().format("YYYY-MM-DD");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    data_nascimento: "",
    responsavel: "",
    plano: "basico",
    email_responsavel: "",
    telefone: "",
    data_matricula: hoje,
    valor_mensalidade: "",
    dia_vencimento: hoje,
    serie: "",
    turno: "",
    observacao: "",
    status: "ativo",
  });

  // Máscara interna para não poluir o componente
  const maskPhone = (value) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "telefone") {
      newValue = maskPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações Básicas
    if (!formData.nome.trim()) return toast.warn("Nome do aluno é obrigatório");
    if (!formData.responsavel.trim())
      return toast.warn("Responsável é obrigatório");
    if (!formData.valor_mensalidade) return toast.warn("Informe a mensalidade");
    if (formData.plano === "premium" && !formData.email_responsavel) {
      return toast.warn("Email é obrigatório no Plano Premium");
    }

    setIsLoading(true);

    try {
      const diaVencimento = dayjs(formData.dia_vencimento).date();

      const payload = {
        ...formData,
        valor_mensalidade: Number(formData.valor_mensalidade),
        dia_vencimento: diaVencimento.toString(),
        email_responsavel:
          formData.plano === "basico" ? null : formData.email_responsavel,
      };

      await api.post("/alunos", payload);
      toast.success("Matrícula realizada com sucesso!");
      navigate("/alunos");
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar matrícula.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isLoading,
    hoje,
  };
}
