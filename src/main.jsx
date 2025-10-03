import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login/Login";
import { Alunos } from "./pages/Alunos/index.jsx";
import CadastroAlunos from "./pages/Alunos/CadastroAlunos.jsx";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import VisualizarDados from "./pages/Alunos/DadoAluno.jsx";
import { EditarAluno } from "./pages/Alunos/EditarAluno.jsx";
import { Professores } from "./pages/Funcionarios/index.jsx";
import CadastroProfessor from "./pages/Funcionarios/CadastroFuncionarios.jsx";
import VisualizarDadosFuncionario from "./pages/Funcionarios/DadosFuncionarios.jsx";
import { EditarFuncionario } from "./pages/Funcionarios/EditarFuncionário.jsx";
import { Lancamentos } from "./pages/Gestao/index.jsx";
import CadastroReceita from "./pages/Gestao/Receita.jsx";
import VisualizarReceita from "./pages/Gestao/DetalheReceita.jsx";
import CadastroDespesa from "./pages/Gestao/Despesa.jsx";
import DetalheDespesa from "./pages/Gestao/DetalheDespesa.jsx";
import { Dashboard } from "./pages/Dashboard/index.jsx";
import RelatorioMensal from "./pages/Dashboard/RelatorioMensal.jsx";
import { Notificacoes } from "./pages/Notificacao/Notificacoes.jsx";

// Middleware de proteção de rota
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alunos",
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Alunos />
          </ProtectedRoute>
        ),
      },
      {
        path: "cadastrar",
        element: (
          <ProtectedRoute>
            <CadastroAlunos />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute>
            <VisualizarDados />
          </ProtectedRoute>
        ),
      },
      {
        path: "editar/:id",
        element: (
          <ProtectedRoute>
            <EditarAluno />
          </ProtectedRoute>
        ),
      },
      {
        path: ":alunoId/receitas/:receitaId",
        element: (
          <ProtectedRoute>
            <VisualizarReceita />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/professores",
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Professores />
          </ProtectedRoute>
        ),
      },
      {
        path: "cadastrar",
        element: (
          <ProtectedRoute>
            <CadastroProfessor />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute>
            <VisualizarDadosFuncionario />
          </ProtectedRoute>
        ),
      },
      {
        path: "editar/:id",
        element: (
          <ProtectedRoute>
            <EditarFuncionario />
          </ProtectedRoute>
        ),
      },
      {
        path: ":professorId/despesas/:despesaId",
        element: (
          <ProtectedRoute>
            <DetalheDespesa />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/lancamentos",
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Lancamentos />
          </ProtectedRoute>
        ),
      },
      {
        path: "receitas",
        element: (
          <ProtectedRoute>
            <CadastroReceita />
          </ProtectedRoute>
        ),
      },
      {
        path: "despesas",
        element: (
          <ProtectedRoute>
            <CadastroDespesa />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: "/relatorio",
    element: (
      <ProtectedRoute>
        <RelatorioMensal />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notificacoes",
    element: (
      <ProtectedRoute>
        <Notificacoes />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
