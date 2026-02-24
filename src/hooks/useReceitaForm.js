import api from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { formatDateForInputSafe } from "../utils/date";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useReceitaForm(searchParams) {
  const navigate = useNavigate();

  // Configurações iniciais
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
    descricao: `Mensalidade referente a ${mesAtual.toString().padStart(2, "0")}/${anoAtual}`,
  });

  // 1. Carregar Alunos (Ativos e Ordenados)
  useEffect(() => {
    async function carregarAlunos() {
      try {
        const res = await api.get("/alunos");
        const listaAlunos = res.data
          .filter((aluno) => aluno.status === "ativo" || aluno.ativo === true)
          .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

        setAlunos(listaAlunos);

        // Lógica de Preenchimento via URL
        const alunoIdUrl = searchParams.get("alunoId");
        if (alunoIdUrl) {
          const encontrado = listaAlunos.find(
            (a) => String(a.id) === alunoIdUrl,
          );
          if (encontrado) {
            setFormData((prev) => ({
              ...prev,
              id_aluno: String(encontrado.id),
              valor: encontrado.valor_mensalidade || "",
            }));
          }
        }
      } catch (error) {
        toast.error("Erro ao carregar lista de alunos.");
      }
    }
    carregarAlunos();
  }, [searchParams]);

  // 2. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newValues = { ...prev, [name]: value };

      if (name === "id_aluno") {
        const selecionado = alunos.find((a) => String(a.id) === String(value));
        if (selecionado) newValues.valor = selecionado.valor_mensalidade;
      }

      if (["mes_referencia", "ano_referencia"].includes(name)) {
        const mes = String(newValues.mes_referencia).padStart(2, "0");
        newValues.descricao = `Mensalidade referente a ${mes}/${newValues.ano_referencia}`;
      }

      return newValues;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_aluno) return toast.warn("Selecione um aluno.");

    try {
      setIsLoading(true);
      const payload = {
        ...formData,
        id_aluno: Number(formData.id_aluno),
        valor: Number(formData.valor),
        data_pagamento: formatDateForInputSafe(formData.data_pagamento),
      };

      await api.post("/receitas", payload);
      toast.success("Pagamento registrado com sucesso! 💰");
      navigate("/lancamentos");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao salvar.");
    } finally {
      setIsLoading(false);
    }
  };
  return {
    formData,
    alunos,
    isLoading,
    handleChange,
    handleSubmit,
    hojeISO,
  };
}
