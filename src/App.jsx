import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import {
  Users,
  GraduationCap,
  Wallet,
  Bell,
  TrendingUp,
  ChevronRight,
  CalendarDays,
  Search,
  ArrowRight
} from "lucide-react";
import { Container } from "./components/Container";
import NavCard from "./components/NavCard";
import QuickStat from "./components/QuickStat";
import Footer from "./components/Footer";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default function App() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const dataHoje = dayjs().format("dddd, D [de] MMMM");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard");
        setResumo(data);
      } catch (error) {
        console.error("Erro ao carregar resumo", error);
      }
    };
    fetchStats();
  }, []);

  // Função para lidar com a busca (Futuro: Redirecionar para lista de alunos filtrada)
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      // Exemplo de ação: Navegar para alunos já filtrando
      navigate(`/alunos?search=${searchTerm}`);
    }
  }

  return (
    <Container className="bg-slate-50/50 min-h-screen pb-10">

      {/* Cabeçalho de Boas Vindas */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-1">
            {dataHoje}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            {saudacao}, <span className="text-pink-700">Julianne</span>.
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Gestão simplificada e eficiente.
          </p>
        </div>

        {resumo && (
          <div className="flex flex-wrap gap-4">
            <QuickStat label="Alunos Ativos" value={resumo.alunos_ativos} icon={Users} />
            <QuickStat label="Aniversariantes" value={resumo.aniversariantes?.length || 0} icon={CalendarDays} />
          </div>
        )}
      </div>

      {/* --- BARRA DE PESQUISA GLOBAL (NOVA) --- */}
      <div className="relative max-w-2xl mb-10 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 shadow-sm transition-all text-base"
          placeholder="Busque por alunos, turmas ou pagamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
        {/* Botão visual de 'Ir' (Opcional, só aparece se tiver texto) */}
        {searchTerm && (
          <button
            onClick={() => handleSearch({ key: 'Enter' })}
            className="absolute inset-y-2 right-2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition animate-fade-in"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
      {/* --------------------------------------- */}

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">

        <NavCard
          title="Alunos"
          description="Matrículas, dados pessoais e histórico."
          icon={GraduationCap}
          colorClass="text-blue-600"
          onClick={() => navigate("/alunos")}
        />

        <NavCard
          title="Financeiro"
          description="Controle de caixa, receitas e despesas."
          icon={Wallet}
          colorClass="text-green-600"
          onClick={() => navigate("/lancamentos")}
        />

        <NavCard
          title="Dashboard"
          description="Gráficos e relatórios gerenciais."
          icon={TrendingUp}
          colorClass="text-purple-600"
          onClick={() => navigate("/dashboard")}
        />

        <NavCard
          title="Professores"
          description="Gestão do corpo docente."
          icon={Users}
          colorClass="text-orange-500"
          onClick={() => navigate("/professores")}
        />

        {/* Card Especial de Ação Rápida */}
        <button
          onClick={() => navigate("/lancamentos/receitas")}
          className="group flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center h-full sm:col-span-2 lg:col-span-1"
        >
          <div className="p-3 bg-white/10 rounded-full mb-3 group-hover:bg-white/20 transition">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Lançar Mensalidade</h3>
          <p className="text-xs text-slate-300">Atalho rápido para recebimentos</p>
        </button>

        <NavCard
          title="Notificações"
          description="Central de avisos."
          icon={Bell}
          colorClass="text-red-500"
          onClick={() => navigate("/notificacoes")}
        />

      </div>

      {/* Rodapé Discreto */}
      <Footer />
    </Container>

  );
}
