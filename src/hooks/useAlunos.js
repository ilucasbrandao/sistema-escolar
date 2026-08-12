import { useState, useEffect, useMemo } from "react";
import api from "../services/api";

export function useAlunos() {
  const [students, setStudents] = useState([]);
  const [professoresList, setProfessoresList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [turnoFilter, setTurnoFilter] = useState("todos");
  const [serieFilter, setSerieFilter] = useState("todas");
  const [professorFilter, setProfessorFilter] = useState("todos");

  const itemsPerPage = 10;

  // Busca lista de alunos e professores
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resAlunos, resProfessores] = await Promise.all([
        api.get("/alunos"),
        api.get("/professores").catch(() => ({ data: [] })),
      ]);

      setStudents(resAlunos.data);

      // Filtra para armazenar apenas professores ativos na lista do filtro
      const profsAtivos = (resProfessores.data || []).filter(
        (prof) => prof.status === "ativo",
      );
      setProfessoresList(profsAtivos);
    } catch (error) {
      console.error("Erro ao buscar dados dos alunos/professores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reseta para a 1ª página quando qualquer filtro for alterado
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showInactive, turnoFilter, serieFilter, professorFilter]);

  // Extrai lista única de séries existentes nos alunos cadastrados
  const seriesList = useMemo(() => {
    const series = students
      .map((s) => s.serie)
      .filter((serie) => serie && serie.trim() !== "");
    return [...new Set(series)].sort();
  }, [students]);

  // Aplica a filtragem combinada nos alunos
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // 1. Busca por nome ou responsável
        const term = searchTerm.toLowerCase();
        const nomeMatch = student.nome?.toLowerCase().includes(term) || false;
        const respMatch =
          student.responsavel?.toLowerCase().includes(term) || false;
        const matchesSearch = nomeMatch || respMatch;

        // 2. Status do Aluno (Ativo/Inativo)
        const matchesStatus = showInactive
          ? student.status === "inativo"
          : student.status === "ativo";

        // 3. Turno
        const matchesTurno =
          turnoFilter === "todos"
            ? true
            : student.turno?.toLowerCase() === turnoFilter.toLowerCase();

        // 4. Série
        const matchesSerie =
          serieFilter === "todas" ? true : student.serie === serieFilter;

        // 5. Professor Responsável
        let matchesProfessor = true;
        if (professorFilter !== "todos") {
          const profId = Number(professorFilter);
          matchesProfessor =
            student.professores_alunos?.some(
              (p) => p.professor_id === profId || p.professor?.id === profId,
            ) || student.professor_id === profId;
        }

        return (
          matchesSearch &&
          matchesStatus &&
          matchesTurno &&
          matchesSerie &&
          matchesProfessor
        );
      })
      .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
  }, [
    students,
    searchTerm,
    showInactive,
    turnoFilter,
    serieFilter,
    professorFilter,
  ]);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja remover este registro?")) return;
    try {
      await api.delete(`/alunos/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert("Erro ao excluir aluno.");
    }
  };

  return {
    students: filteredStudents,
    professoresList,
    seriesList,
    searchTerm,
    setSearchTerm,
    showInactive,
    setShowInactive,
    turnoFilter,
    setTurnoFilter,
    serieFilter,
    setSerieFilter,
    professorFilter,
    setProfessorFilter,
    currentPage,
    setCurrentPage,
    isLoading,
    itemsPerPage,
    handleDelete,
    totalItems: filteredStudents.length,
  };
}
