import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { LogOut, User, Calendar, ArrowRight } from "lucide-react"; // Adicionei ArrowRight para ficar visual

export default function MeusFilhos() {
  const [filhos, setFilhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Recupera dados do usuário (Pai)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function loadFilhos() {
      try {
        const { data } = await api.get("/alunos/meus-filhos");
        setFilhos(data);
      } catch (error) {
        console.error("Erro ao buscar filhos", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    loadFilhos();
  }, [navigate]);

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- HEADER --- */}
      <header className="bg-gradient-to-r from-cyan-600 to-indigo-900 text-white p-6 shadow-lg mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Olá, {user.nome?.split(" ")[0]}!</h1>
            <p className="text-cyan-100 text-sm opacity-90">Acompanhe o desenvolvimento escolar</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition flex items-center gap-2 text-sm px-4"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </header>

      {/* --- CONTEÚDO --- */}
      <main className="max-w-4xl mx-auto px-6 pb-10">
        <h2 className="text-gray-700 font-bold text-xl mb-6 flex items-center gap-2">
          <User className="text-cyan-600" /> Meus Filhos
        </h2>

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
          </div>
        ) : filhos.length === 0 ? (
          <div className="text-center mt-10 p-8 bg-white rounded-2xl shadow border border-gray-100">
            <p className="text-gray-500 text-lg">Nenhum aluno vinculado à sua conta.</p>
            <p className="text-sm text-gray-400 mt-2">Entre em contato com a secretaria para vincular.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filhos.map((filho) => (
              <div
                key={filho.id}
                // --- AQUI ESTÁ A MÁGICA ---
                // Navega para a rota /diario/1 (por exemplo)
                onClick={() => navigate(`/meus-filhos/diario/${filho.id}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group relative"
              >
                {/* Faixa colorida lateral */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-cyan-500 group-hover:bg-indigo-600 transition-colors"></div>

                <div className="p-6 pl-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                        {filho.nome}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 font-medium uppercase tracking-wide">
                        {filho.serie || "Série não informada"} • {filho.turno || "Turno não inf."}
                      </p>
                    </div>
                    {/* Avatar Simples */}
                    <div className="h-12 w-12 bg-cyan-50 text-cyan-700 rounded-full flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <User size={24} />
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-wider">
                      Ativo
                    </span>

                    <button className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver Diário <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}