import * as XLSX from "xlsx";
import api from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export function useRelatorios() {
  const exportarAlunosAtivos = async () => {
    try {
      toast.info("Gerando relatório...");
      const { data } = await api.get("/alunos");

      // 1. Filtramos apenas os ativos
      const alunosAtivos = data.filter((aluno) => aluno.status === "ativo");

      // 2. Formatamos os dados para o Excel (Colunas bonitinhas)
      const dadosFormatados = alunosAtivos.map((aluno) => ({
        "Nome do Aluno": aluno.nome.toUpperCase(),
        Série: aluno.serie || "Não informada",
        Turno: aluno.turno || "Não informado",
        Responsável: aluno.responsavel,
        Telefone: aluno.telefone || "—",
        "Data de Matrícula": dayjs(aluno.data_matricula).format("DD/MM/YYYY"),
      }));

      // 3. Criamos a planilha
      const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos Ativos");

      // 4. Ajuste de largura das colunas (opcional, mas profissional)
      worksheet["!cols"] = [
        { wch: 35 }, // Nome
        { wch: 20 }, // Série
        { wch: 15 }, // Turno
        { wch: 25 }, // Responsável
        { wch: 20 }, // Telefone
        { wch: 18 }, // Matrícula
      ];

      // 5. Gera o arquivo e inicia o download
      const dataHoje = dayjs().format("DD-MM-YYYY");
      XLSX.writeFile(workbook, `Relacao_Alunos_Ativos_${dataHoje}.xlsx`);

      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar relatório.");
    }
  };

  return { exportarAlunosAtivos };
}
