import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOutIcon, CircleDollarSign, BanknoteArrowDown } from "lucide-react";
import { Container, Title } from "./components/Container";
import { Button } from "./components/Button";
import { ActionCard, InfoCard } from "./components/ActionCard";
import Footer from "./components/Footer";
import api from "./services/api";
import { Logo } from "./components/TopBackground"

function formatarDataLegivel(dataISO) {
  if (!dataISO) return "—";
  const diaMesAno = dataISO.split("T")[0] || dataISO;
  const [ano, mes, dia] = diaMesAno.split("-");
  return `${dia}/${mes}`;
}


export default function App() {
  const [dados, setDados] = useState(null);
  const navigate = useNavigate();

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

  const handleClick = (path) => navigate(`/${path}`);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <Container className="px-4 sm:px-8 py-6">
      {/* Header */}
      <header className="relative flex items-center mb-12 h-25">
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-4">
            <Logo />
          </div>
          <Title
            level={1}
            className="absolute left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-center"
          >
            Espaço ao Pé da Letra
          </Title>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={handleLogout}
          className="ml-auto"
        >
          <LogOutIcon className="w-4 h-4 mr-1" /> Sair
        </Button>
      </header>

      {/* Ações Rápidas */}
      <section className="mb-12">
        <Title level={2} className="text-xl font-semibold mb-4">Ações Rápidas</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

      {/* Navegação Compacta */}
      <section className="mb-12">
        <Title level={2} className="text-xl font-semibold mb-4 text-center">Gestão Escolar</Title>
        <div className="flex flex-wrap justify-center gap-3">
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
              className="rounded-full px-5 py-2 text-sm hover:scale-105 transition-transform"
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
          <Title level={2} className="text-xl font-semibold mb-4">Resumo do Mês</Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard
              title="Aniversariantes"
              icon="🎂"
              value={dados.aniversariantes.map(a => (
                <span key={a.nome}>
                  <p className="text-sm">
                    {a.nome} - {formatarDataLegivel(a.data_nascimento)}
                  </p>
                </span>
              ))}
            />
            <InfoCard
              title="Alunos por Turno"
              icon="🕒"
              value={Object.entries(dados.alunos_por_turno).map(([turno, qtd]) => (
                <p key={turno}>{turno}: {qtd}</p>
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

      <Footer
        appName="ERP Escolar"
        year={2025}
        author="Lucas Brandão"
        authorLink="https://github.com/ilucasbrandao"
      />
    </Container>
  );
}
