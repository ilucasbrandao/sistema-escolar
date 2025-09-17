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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
