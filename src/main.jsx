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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
