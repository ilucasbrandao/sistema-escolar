import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";

// --- Importações das páginas ---
import App from "./App.jsx";
import Login from "./pages/Login/Login";

// Alunos
import { Alunos } from "./pages/Alunos/index.jsx";
import CadastroAlunos from "./pages/Alunos/CadastroAlunos.jsx";
import VisualizarDados from "./pages/Alunos/DadoAluno.jsx";
import { EditarAluno } from "./pages/Alunos/EditarAluno.jsx";

// Funcionários
import { Professores } from "./pages/Funcionarios/index.jsx";
import CadastroProfessor from "./pages/Funcionarios/CadastroFuncionarios.jsx";
import VisualizarDadosFuncionario from "./pages/Funcionarios/DadosFuncionarios.jsx";
import { EditarFuncionario } from "./pages/Funcionarios/EditarFuncionário.jsx";

// Gestão
import { Lancamentos } from "./pages/Gestao/index.jsx";
import CadastroReceita from "./pages/Gestao/Receita.jsx";
import VisualizarReceita from "./pages/Gestao/DetalheReceita.jsx";
import CadastroDespesa from "./pages/Gestao/Despesa.jsx";
import DetalheDespesa from "./pages/Gestao/DetalheDespesa.jsx";

// Dashboard & Notificações
import { Dashboard } from "./pages/Dashboard/index.jsx";
import RelatorioMensal from "./pages/Dashboard/RelatorioMensal.jsx";
import { Notificacoes } from "./pages/Notificacao/Notificacoes.jsx";
import { NotificationProvider } from "./context/NotificationContext";

// Pais & Diário
import MeusFilhos from './pages/MeusFilhos';
import Diario from './pages/Diario';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Sidebar } from "./components/Sidebar.jsx";
import { MobileHeader } from "./components/MobileHeader.jsx";
import ListaAlunosDiario from "./pages/Diario/ListaAlunos.jsx";

// =================================================================
// 👮‍♂️ O PORTEIRO (Funções de verificação)
// =================================================================
const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");
const isAuthenticated = () => !!localStorage.getItem("token");

// 1. LAYOUT ADMIN & PROFESSORES
const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const user = getUser();
  // 🚫 SE FOR PAI, NÃO PODE ESTAR AQUI! VAI PARA OS FILHOS.
  if (user.role === 'responsavel') {
    return <Navigate to="/meus-filhos" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col h-screen w-full md:ml-64 transition-all duration-300">
        <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// 2. LAYOUT APENAS PAIS
// Proteção: Se for ADMIN/PROF, é expulso para o Dashboard.
const ParentLayout = () => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const user = getUser();
  // 🚫 SE NÃO FOR PAI (Ex: Admin clicou num link errado), VOLTA PRO DASHBOARD.
  if (user.role !== 'responsavel') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Renderiza a página limpa
};

// 3. BLOQUEIO EXTRA: Só ADMIN pode acessar (Para Financeiro/Gestão)
// Professores não passam aqui.
const OnlyAdmin = ({ children }) => {
  const user = getUser();
  if (user.role !== 'admin') {
    // Se professor tentar acessar financeiro, volta pra home dele
    return <Navigate to="/" replace />;
  }
  return children;
};

// =================================================================
// 🛣️ ROTAS
// =================================================================
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },

  // --- ÁREA DE STAFF (Admin + Professores) ---
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "/", element: <App /> }, // Home
      { path: "notificacoes", element: <Notificacoes /> },

      // Rota COMUM (Admin e Prof podem ver Diário)
      { path: "diario-classe", element: <ListaAlunosDiario /> },
      { path: "diario/:id", element: <Diario /> },

      // Módulo Alunos (Admin e Prof acessam)
      {
        path: "alunos",
        children: [
          { path: "", element: <Alunos /> },
          { path: "cadastrar", element: <CadastroAlunos /> },
          { path: ":id", element: <VisualizarDados /> },
          { path: "editar/:id", element: <EditarAluno /> },
        ],
      },

      // --- ÁREAS EXCLUSIVAS DE ADMIN (Protegidas com OnlyAdmin) ---
      {
        path: "dashboard",
        element: <OnlyAdmin><Dashboard /></OnlyAdmin>
      },
      {
        path: "relatorio",
        element: <OnlyAdmin><RelatorioMensal /></OnlyAdmin>
      },
      {
        path: "professores",
        element: <OnlyAdmin><Outlet /></OnlyAdmin>, // Protege todo o bloco
        children: [
          { path: "", element: <Professores /> },
          { path: "cadastrar", element: <CadastroProfessor /> },
          { path: ":id", element: <VisualizarDadosFuncionario /> },
          { path: "editar/:id", element: <EditarFuncionario /> },
          { path: ":professorId/despesas/:despesaId", element: <DetalheDespesa /> },
        ],
      },
      {
        path: "lancamentos",
        element: <OnlyAdmin><Outlet /></OnlyAdmin>, // Protege todo o bloco
        children: [
          { path: "", element: <Lancamentos /> },
          { path: "receitas", element: <CadastroReceita /> },
          { path: "despesas", element: <CadastroDespesa /> },
        ],
      },
    ],
  },

  // --- ÁREA DOS PAIS (Sem Sidebar) ---
  {
    element: <ParentLayout />,
    children: [
      { path: "/meus-filhos", element: <MeusFilhos /> },
      { path: "/meus-filhos/diario/:id", element: <Diario /> },
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </NotificationProvider>
  </StrictMode>
);