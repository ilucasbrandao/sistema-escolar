import { StrictMode } from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";

// Importações das páginas (Mantive as suas)
import App from "./App.jsx";
import Login from "./pages/Login/Login";
import { Alunos } from "./pages/Alunos/index.jsx";
import CadastroAlunos from "./pages/Alunos/CadastroAlunos.jsx";
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
import { NotificationProvider } from "./context/NotificationContext";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Sidebar } from "./components/Sidebar.jsx";
import { MobileHeader } from "./components/MobileHeader.jsx";

const PrivateLayout = () => {
  const token = localStorage.getItem("token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Controle do Menu

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen w-full md:ml-64 transition-all duration-300">

        <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


const router = createBrowserRouter([
  // Rota Pública
  { path: "/login", element: <Login /> },

  // Rotas Privadas (Todas protegidas pelo PrivateLayout)
  {
    path: "/",
    element: <PrivateLayout />,
    children: [
      { path: "/", element: <App /> }, // Home

      // Módulo Dashboard
      { path: "dashboard", element: <Dashboard /> },

      // Módulo Relatórios e Notificações
      { path: "relatorio", element: <RelatorioMensal /> },
      { path: "notificacoes", element: <Notificacoes /> },

      // Módulo Alunos
      {
        path: "alunos",
        children: [
          { path: "", element: <Alunos /> },
          { path: "cadastrar", element: <CadastroAlunos /> },
          { path: ":id", element: <VisualizarDados /> },
          { path: "editar/:id", element: <EditarAluno /> },
          { path: ":alunoId/receitas/:receitaId", element: <VisualizarReceita /> },
        ],
      },

      // Módulo Professores
      {
        path: "professores",
        children: [
          { path: "", element: <Professores /> },
          { path: "cadastrar", element: <CadastroProfessor /> },
          { path: ":id", element: <VisualizarDadosFuncionario /> },
          { path: "editar/:id", element: <EditarFuncionario /> },
          { path: ":professorId/despesas/:despesaId", element: <DetalheDespesa /> },
        ],
      },

      // Módulo Lançamentos
      {
        path: "lancamentos",
        children: [
          { path: "", element: <Lancamentos /> },
          { path: "receitas", element: <CadastroReceita /> },
          { path: "despesas", element: <CadastroDespesa /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000} // Fecha sozinho em 3 segundos
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Fica visualmente mais bonito (verde/vermelho sólido)
      />
    </NotificationProvider>
  </StrictMode>
);
