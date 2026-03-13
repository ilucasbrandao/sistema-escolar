import { useState, useEffect, useMemo } from "react";
import api from "../services/api";

export function useAlunos() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [turnoFilter, setTurnoFilter] = useState("todos");
  const itemsPerPage = 10;

  const getStudents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/alunos");
      setStudents(data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showInactive, turnoFilter]);

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = showInactive
          ? student.status === "inativo"
          : student.status === "ativo";
        const matchesTurno =
          turnoFilter === "todos" ? true : student.turno === turnoFilter;
        return matchesSearch && matchesStatus && matchesTurno;
      })
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [students, searchTerm, showInactive, turnoFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja remover este registro?")) return;
    try {
      await api.delete(`/alunos/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  return {
    students: filteredStudents,
    searchTerm,
    setSearchTerm,
    showInactive,
    setShowInactive,
    turnoFilter,
    setTurnoFilter,
    currentPage,
    setCurrentPage,
    isLoading,
    itemsPerPage,
    handleDelete,
    totalItems: filteredStudents.length,
  };
}
