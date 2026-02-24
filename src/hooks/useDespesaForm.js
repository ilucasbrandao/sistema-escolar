import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export function useDespesaForm(searchParams) {
  const navigate = useNavigate();

  // Configurações Iniciais
  const hoje = dayjs().format("YYYY-MM-DD");
  const mesAtual = dayjs().month() + 1;
  const anoAtual = dayjs().year();

  const [isLoading, setIsLoading] = useState(false);
  const [professores, setProfessores] = useState([]);
  const [formData, setFormData] = useState({
    id_professor: "",
    valor: "",
    data_pagamento: hoje,
    mes_referencia: mesAtual,
    ano_referencia: anoAtual,
    descricao: "",
    categoria: "",
  });

  const categorias = [
    { label: "Salários", value: "salarios" },
    { label: "Material de Escritório", value: "material" },
    { label: "Aluguel", value: "aluguel" },
    { label: "Água", value: "agua" },
    { label: "Energia", value: "energia" },
    { label: "Internet", value: "internet" },
    { label: "Manutenção", value: "manutencao" },
    { label: "Lanche/Cozinha", value: "alimentacao" },
    { label: "Outros", value: "outros" },
  ];

  // 1. Carregar Professores e Verificar URL
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const res = await api.get("/professores");
        setProfessores(res.data);

        // --- LÓGICA DE AUTO-SELEÇÃO ---
        const profIdUrl = searchParams.get("profId");
        const tipoUrl = searchParams.get("tipo");

        if (profIdUrl) {
          const professorExiste = res.data.find(
            (p) => String(p.id) === String(profIdUrl),
          );

          if (professorExiste) {
            setFormData((prev) => ({
              ...prev,
              id_professor: profIdUrl,
              // Se veio tipo=salario, já preenche a categoria
              categoria: tipoUrl === "salario" ? "salarios" : prev.categoria,
            }));
          }
        }
        // ------------------------------
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
        toast.error("Erro ao carregar lista de professores.");
      }
    }
    carregarDadosIniciais();
  }, [searchParams]);
  // 2. Auto-Preencher Descrição (Atualizado para incluir nome do professor se selecionado)
  useEffect(() => {
    const catLabel =
      categorias.find((c) => c.value === formData.categoria)?.label ||
      "Despesa";
    let novaDescricao = "";

    // Se for salário e tiver professor selecionado, personaliza a descrição
    if (formData.categoria === "salarios" && formData.id_professor) {
      const nomeProf =
        professores.find((p) => String(p.id) === String(formData.id_professor))
          ?.nome || "Professor";
      novaDescricao = `Salário - ${nomeProf} - ${formData.mes_referencia}/${formData.ano_referencia}`;
    } else {
      // Descrição padrão
      novaDescricao = formData.categoria
        ? `${catLabel} referente a ${formData.mes_referencia}/${formData.ano_referencia}`
        : `Despesa referente a ${formData.mes_referencia}/${formData.ano_referencia}`;
    }

    setFormData((prev) => ({ ...prev, descricao: novaDescricao }));
  }, [
    formData.categoria,
    formData.mes_referencia,
    formData.ano_referencia,
    formData.id_professor,
    professores,
  ]);

  // 2. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação
    if (!formData.valor || Number(formData.valor) <= 0)
      return toast.warn("Informe um valor válido.");
    if (!formData.categoria) return toast.warn("Selecione uma categoria.");
    if (!formData.data_pagamento)
      return toast.warn("Informe a data do pagamento.");

    // Validação específica para salários
    if (formData.categoria === "salarios" && !formData.id_professor) {
      return toast.warn("Para lançar salário, selecione o professor.");
    }

    setIsLoading(true);

    try {
      const payload = {
        id_professor: formData.id_professor
          ? Number(formData.id_professor)
          : null,
        valor: Number(formData.valor),
        categoria: formData.categoria,
        data_pagamento: formData.data_pagamento,
        mes_referencia: Number(formData.mes_referencia),
        ano_referencia: Number(formData.ano_referencia),
        descricao: formData.descricao,
      };

      await api.post("/despesa", payload);
      toast.success("Despesa lançada com sucesso!");
      navigate("/lancamentos");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar despesa.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    formData,
    isLoading,
    professores,
    handleChange,
    hoje,
    categorias,
  };
}
