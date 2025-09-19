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
import LancamentoForm from "./pages/Gestao/LancamentoForm.jsx";

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
    element: (
      <ProtectedRoute>
        <Alunos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alunos/cadastrar",
    element: (
      <ProtectedRoute>
        <CadastroAlunos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alunos/:id",
    element: (
      <ProtectedRoute>
        <VisualizarDados />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alunos/editar/:id",
    element: (
      <ProtectedRoute>
        <EditarAluno />
      </ProtectedRoute>
    )

  },
  {
    path: "/professores",
    element: (
      <ProtectedRoute>
        <Professores />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professores/cadastrar",
    element: (
      <ProtectedRoute>
        <CadastroProfessor />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professores/:id",
    element: (
      <ProtectedRoute>
        <VisualizarDadosFuncionario />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professores/editar/:id",
    element: (
      <ProtectedRoute>
        <EditarFuncionario />
      </ProtectedRoute>
    )

  },
  {
    path: "/gestao-financeira",
    element: (
      <ProtectedRoute>
        <Lancamentos />
      </ProtectedRoute>
    )
  },
  {
    path: "/gestao-financeira/cadastrar",
    element: (
      <ProtectedRoute>
        <LancamentoForm />
      </ProtectedRoute>
    )
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
