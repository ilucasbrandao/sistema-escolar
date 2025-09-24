import { LogOutIcon, CircleDollarSign, BanknoteArrowDown } from "lucide-react";
import { Button } from "./components/Button";
import { Container, TitleH1, TitleH3 } from "./components/Container";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./services/api"



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
        <Button variant="red" onClick={handleLogout}>
          <LogOutIcon className="w-5 h-5" />
        </Button>
      </div>
      <TitleH1>Reforço Escolar Tia Jeane</TitleH1>
      <div>
        <TitleH3>Dashboard</TitleH3>
      </div>
      <div className="mt-10">
        <TitleH3>Lançamentos Rápidos</TitleH3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          <Button
            onClick={() =>
              navigate("lancamentos/mensalidade", { state: { tipo: "entrada" } })
            }
            className="flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-lg shadow-md"
          >
            <CircleDollarSign className="w-5 h-5" /> Lançar Mensalidade
          </Button>

          <Button
            onClick={() =>
              navigate("/lancamentos/cadastrar", { state: { tipo: "saida" } })
            }
            className="flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold bg-red-500 hover:bg-red-600 rounded-lg shadow-md"
          >
            <BanknoteArrowDown className="w-5 h-5" /> Lançar Despesa
          </Button>
        </div>

      </div>


      <div><h3>Campos de Navegação</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <Button variant="blue" onClick={() => handleClick("alunos")}>
            Alunos
          </Button>
          <Button variant="green" onClick={() => handleClick("professores")}>
            Professores
          </Button>
          <Button
            variant="purple"
            onClick={() => handleClick("lancamentos")}
          >
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

      <Footer />
    </Container>
  );
}
