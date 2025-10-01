import { LogOutIcon, CircleDollarSign, BanknoteArrowDown } from "lucide-react";
import { Button } from "./components/Button";
import { Container, Title } from "./components/Container";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./services/api";
import { ActionCard, InfoCard } from "./components/ActionCard";

export default function App() {
  const [dados, setDados] = useState(null);
  const testar = async () => {
    try {
      const res = await api.get("/ping");
      alert(res.data.message);
    } catch (err) {
      alert("Erro ao conectar com a API");
    }
  };

  const carregarDashboard = async () => {
    try {
      const { data } = await api.get("/dashboard");
      setDados(data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  const navigate = useNavigate();

  const handleClick = (label) => navigate(`/${label}`);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <Container>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 ">
        <Title level={1} className="text-center">Reforço Escolar Tia Juh</Title>
        <Button variant="outline" size="md" onClick={handleLogout}>
          <LogOutIcon className="w-4 h-4" /> Sair
        </Button>
      </div>

      {/* Ações rápidas */}
      <section className="mb-12">
        <Title level={2}>Ações Rápidas</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <ActionCard
            icon={<CircleDollarSign className="w-6 h-6 text-green-500" />}
            label="Lançar Mensalidade"
            onClick={() =>
              navigate("lancamentos/receitas", { state: { tipo: "entrada" } })
            }
          />
          <ActionCard
            icon={<BanknoteArrowDown className="w-6 h-6 text-red-500" />}
            label="Lançar Despesa"
            onClick={() =>
              navigate("/lancamentos/despesas", { state: { tipo: "saida" } })
            }
          />
        </div>
      </section>

      {/* Navegação compacta */}
      <section className="mb-8">
        <Title level={2} className=" flex text-center">Gestão Escolar</Title>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: "Alunos", path: "alunos" },
            { label: "Professores", path: "professores" },
            { label: "Financeiro", path: "lancamentos" },
            { label: "Notificações", path: "notificacoes" },
            { label: "Dashboard", path: "dashboard" },
          ].map(({ label, path }) => (
            <Button
              key={label}
              variant="pastelBlue"
              size="sm"
              className="rounded-full px-4 py-2 text-xs sm:text-sm"
              onClick={() => handleClick(path)}
            >
              {label}
            </Button>
          ))}
        </div>

      </section>

      {/* Cards informativos */}
      {dados && (
        <section className="mb-12">
          <Title level={2}>Resumo do Mês</Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <InfoCard
              title="Aniversariantes"
              icon="🎂"
              value={dados.aniversariantes.map(a => (
                <span key={a.nome}>
                  <p>{a.nome} - {new Date(a.data_nascimento).toLocaleDateString()}</p>
                </span>
              ))}
            />
            <InfoCard
              title="Alunos por Turno"
              icon="🕒"
              value={Object.entries(dados.alunos_por_turno).map(([turno, qtd]) => (
                <p key={turno}>{turno}: {qtd} </p>
              ))}
            />
            <InfoCard
              title="Alunos Ativos"
              icon="👨‍🎓"
              value={<span className="font-bold text-xl">{dados.alunos_ativos}</span>}
            />
            <InfoCard
              title="Professores"
              icon="👩‍🏫"
              value={<span className="font-bold text-xl">{dados.professores_ativos}</span>}
            />
          </div>
        </section>
      )}


      {/* Teste de conexão 
      <div className="text-center my-6">
        <Button variant="ghost" onClick={testar}>
          Testar conexão com servidor
        </Button>
      </div>
      */}
      <Footer
        appName="ERP Escolar"
        year={2025}
        author="Lucas Brandão"
        authorLink="https://github.com/ilucasbrandao"
      />
    </Container>

  );
}
