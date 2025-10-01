import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import { Container, Paragraph, Title } from "../../components/Container";
import { Button } from "../../components/Button";
import {
    ChevronLeftIcon,
    Eye,
    Pencil,
    Trash,
    UserRoundPlus,
} from "lucide-react";

export function Professores() {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [onlyActive, setOnlyActive] = useState(false);
    let filteredTeachers = teachers;

    useEffect(() => {
        async function getTeacher() {
            try {
                const { data } = await api.get("/professores");
                setTeachers(data);
            } catch (error) {
                console.error("Erro ao buscar professores:", error.message);
            }
        }
        getTeacher();
    }, []);

    if (searchTerm) {
        filteredTeachers = teachers.filter((t) =>
            t.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    if (onlyActive) {
        filteredTeachers = filteredTeachers.filter((t) => t.status === 'ativo')
    }
    async function handleDelete(id) {
        const senha = prompt("Digite a senha para excluir o professor(a):");
        const senhaCorreta = import.meta.env.VITE_SENHA_EXCLUSAO;

        if (senha !== senhaCorreta) {
            alert("Senha incorreta. Exclusão cancelada.");
            return;
        }
        const confirm = window.confirm("Tem certeza que deseja excluir este professor(a)?");
        if (!confirm) return;

        try {
            await api.delete(`/professores/${id}`);
            setTeachers((prev) => prev.filter((t) => t.id !== id));
            alert("Professor(a) excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir professor(a):", error.message);
            alert("Erro ao excluir professor(a).");
        }
    }

    return (
        <Container>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" />
                </Button>
                <Title level={1} className="text-2xl font-bold text-slate-800">Professores</Title>
                <div className="flex gap-2">

                    <Button onClick={() => navigate("/professores/cadastrar")}>
                        <UserRoundPlus className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <Paragraph muted className="text-center text-sm text-slate-600 mb-4">
                Informações sobre os professores serão exibidas abaixo.
            </Paragraph>

            {/* Campo de busca */}
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
                <input
                    type="text"
                    placeholder="Pesquisar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-72 p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
            <label className="flex items-center gap-2 text-sm mb-4">
                <input
                    type="checkbox"
                    checked={onlyActive}
                    onChange={(e) => setOnlyActive(e.target.checked)}
                    className="w-4 h-4"
                />
                Mostrar apenas professores ativos
            </label>

            {/* Tabela */}
            <div className="overflow-x-auto">
                <ul className="min-w-[700px] divide-y divide-slate-200 rounded-md border border-slate-300 bg-white shadow-sm">
                    {/* Cabeçalho */}
                    <li className="grid grid-cols-6 gap-4 p-3 bg-slate-100 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                        <span>ID</span>
                        <span>Nome</span>
                        <span>Salário</span>
                        <span>Turno</span>
                        <span>Status</span>
                        <span className="text-center col-span-1">Ações</span>
                    </li>

                    {/* Linhas */}
                    {filteredTeachers.map((t) => (
                        <li
                            key={t.id}
                            className="grid grid-cols-6 gap-4 p-3 text-sm odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <span className="text-slate-500">{t.id}</span>
                            <span className="font-medium text-slate-800">{t.nome}</span>
                            <span className="text-slate-700 font-semibold">
                                {t.salario}
                            </span>
                            <span className="font-medium text-slate-800">{t.turno}</span>
                            <span className={`font-semibold ${t.status === "ativo" ? "text-green-600" : "text-red-600"}`}>
                                {t.status}
                            </span>
                            <span className="flex justify-center gap-2 col-span-1">
                                <button
                                    onClick={() => navigate(`/professores/editar/${t.id}`)}
                                    className="p-1.5 rounded-md hover:bg-blue-50 transition"
                                >
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="p-1.5 rounded-md hover:bg-red-50 transition"
                                >
                                    <Trash className="w-4 h-4 text-red-600" />
                                </button>
                                <button
                                    onClick={() => navigate(`/professores/${t.id}`)}
                                    className="p-1.5 rounded-md hover:bg-slate-200 transition"
                                >
                                    <Eye className="w-4 h-4 text-slate-600" />
                                </button>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {
                filteredTeachers.length === 0 && (
                    <p className="text-center text-sm text-slate-500 mt-4">
                        Nenhum professor(a) encontrado com esse termo.
                    </p>
                )
            }
        </Container >
    );
}
