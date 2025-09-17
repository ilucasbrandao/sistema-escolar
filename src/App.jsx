import { LogOutIcon } from "lucide-react";
import { Button } from "./components/Button";
import { Container, TitleH1, TitleH3 } from "./components/Container";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ResumoCard } from "./components/ResumoCard";
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

  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    async function fetchResumo() {
      try {
        const { data } = await api.get("/dashboard/resumo");
        setResumo(data);
      } catch (error) {
        console.error("Erro ao carregar resumo:", error.message);
      }
    }
    fetchResumo();
  }, []);


  return (
    <Container>
      {/* Botão de Logout */}
      <div className="flex mb-6">
        <Button variant="red" onClick={handleLogout}>
          <LogOutIcon className="w-5 h-5" />
        </Button>
      </div>
      <TitleH1>Reforço Escolar Tia Jeane</TitleH1>

      <TitleH3>Dashboard</TitleH3>

      {resumo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 px-4">
          <ResumoCard label="Últimas Matrículas" value={`${resumo.ultimasMatriculas} esta semana`} />
          <ResumoCard label="Saldo de Entradas" value={`R$ ${resumo.saldoEntradas.toFixed(2)}`} color="green" />
          <ResumoCard label="Saldo de Saídas" value={`R$ ${resumo.saldoSaidas.toFixed(2)}`} color="red" />
          <ResumoCard label="Alunos Ativos" value={resumo.alunosAtivos} />
          <ResumoCard label="Alunos Inativos" value={resumo.alunosInativos} />
          <ResumoCard label="Professores Ativos" value={resumo.professoresAtivos} />
        </div>
      )}



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <Button variant="blue" onClick={() => handleClick("alunos")}>
          Alunos
        </Button>
        <Button variant="green" onClick={() => handleClick("professores")}>
          Professores
        </Button>
        <Button
          variant="purple"
          onClick={() => handleClick("gestao-financeira")}
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

      <button onClick={testar}>Testar conexão</button>

      <Footer />
    </Container>
  );
}
