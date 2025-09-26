import { LogOutIcon, CircleDollarSign, BanknoteArrowDown } from "lucide-react";
import { Button } from "./components/Button";
import { Container, Title } from "./components/Container";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./services/api";

export default function App() {
  const testar = async () => {
    try {
      const res = await api.get("/ping");
      alert(res.data.message);
    } catch (err) {
      alert("Erro ao conectar com a API");
    }
  };

  const navigate = useNavigate();

  const handleClick = (label) => navigate(`/${label}`);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <Container>
      {/* Botão de Logout */}
      <div className="flex mb-6 alie">
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          <LogOutIcon className="w-5 h-5" />
        </Button>
      </div>
      <Title level={1}>Reforço Escolar Tia Jeane</Title>
      <div>
        <Title level={3}>Dashboard</Title>
      </div>
      <div className="mt-10">
        <Title level={3}>Lançamentos Rápidos</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          <Button
            onClick={() =>
              navigate("lancamentos/receitas", { state: { tipo: "entrada" } })
            }
            className="flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-lg shadow-md"
          >
            <CircleDollarSign className="w-5 h-5" /> Lançar Mensalidade
          </Button>

          <Button
            onClick={() =>
              navigate("/lancamentos/despesas", { state: { tipo: "saida" } })
            }
            className="flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold bg-red-500 hover:bg-red-600 rounded-lg shadow-md"
          >
            <BanknoteArrowDown className="w-5 h-5" /> Lançar Despesa
          </Button>
        </div>
      </div>

      <div>
        <Title level={3}>Campos de Navegação</Title>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <Button variant="blue" onClick={() => handleClick("alunos")}>
            Alunos
          </Button>
          <Button variant="green" onClick={() => handleClick("professores")}>
            Professores
          </Button>
          <Button variant="purple" onClick={() => handleClick("lancamentos")}>
            Gestão Financeira
          </Button>
          <Button variant="yellow" onClick={() => handleClick("notificacoes")}>
            Notificações
          </Button>
          <Button variant="pink" onClick={() => handleClick("gerar-relatorio")}>
            Gerar Relatório
          </Button>
        </div>
      </div>
      <button onClick={testar}>Testar conexão</button>

      <Footer
        appName="ERP Escolar"
        year={2025}
        author="Lucas Brandão"
        authorLink="https://github.com/ilucasbrandao"
      />
    </Container>
  );
}
