import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export function useDiario(alunoId) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fotos
  const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const initialFormState = {
    bimestre: "1º Bimestre",
    pedagogico: {
      leitura: "Em desenvolvimento",
      escrita: "Em desenvolvimento",
      foco: "Em desenvolvimento",
      comportamento: "Em desenvolvimento",
    },
    psico: {
      atencao_memoria: "",
      interacao_social: "",
      regulacao_emocional: "",
      habilidades_cognitivas: "",
      coordenacao_motora: "",
      raciocinio_logico: "",
    },
    fotos: [],
    observacao: "",
  };

  const [form, setForm] = useState(initialFormState);

  async function loadData() {
    try {
      setLoading(true);
      const res = await api.get(`/feedbacks/aluno/${alunoId}`);
      setFeedbacks(res.data);
    } catch (error) {
      toast.error("Erro ao carregar diário.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (alunoId) loadData();
  }, [alunoId]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setArquivosSelecionados((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index, isExisting = false) => {
    if (isExisting) {
      setForm((prev) => ({
        ...prev,
        fotos: prev.fotos.filter((_, i) => i !== index),
      }));
    } else {
      setArquivosSelecionados((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("aluno_id", alunoId);
      formData.append("bimestre", form.bimestre);
      formData.append("avaliacao_pedagogica", JSON.stringify(form.pedagogico));
      formData.append("avaliacao_psico", JSON.stringify(form.psico));
      formData.append("observacao", form.observacao);
      formData.append("fotos_existentes", JSON.stringify(form.fotos));

      arquivosSelecionados.forEach((file) => formData.append("imagens", file));

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingId) {
        await api.put(`/feedbacks/${editingId}`, formData, config);
        toast.success("Relatório atualizado!");
      } else {
        await api.post("/feedbacks", formData, config);
        toast.success("Relatório publicado!");
      }

      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error("Erro ao salvar relatório.");
    } finally {
      setSending(false);
    }
  };

  const handleCiente = async (feedbackId) => {
    try {
      // Chamada para a API marcar como lido
      await api.patch(`/feedbacks/ler/${feedbackId}`);

      // Atualiza o estado local para refletir a mudança instantaneamente na tela
      setFeedbacks((prev) =>
        prev.map((item) =>
          item.id === feedbackId ? { ...item, lido_pelos_pais: true } : item,
        ),
      );

      toast.success("Recebimento confirmado! 👍");
    } catch (error) {
      console.error("Erro ao confirmar leitura:", error);
      toast.error("Não foi possível confirmar a leitura agora.");
    }
  };

  return {
    feedbacks,
    setFeedbacks,
    loading,
    isModalOpen,
    setIsModalOpen,
    sending,
    editingId,
    setEditingId,
    form,
    setForm,
    handleFileSelect,
    removeFile,
    handleSave,
    previewUrls,
    initialFormState,
    handleCiente,
    loadData,
  };
}
