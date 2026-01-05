import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  LogOut,
  User,
  ArrowRight,
  Camera,
  Bell,
  MessageCircle,
  GraduationCap,
  CalendarDays
} from "lucide-react";

// IMPORTANDO AS CONFIGURAÇÕES ESTÁTICAS
import { SCHOOL_INFO } from "../../config/schoolConfig";

// Componente de Banner (Agora usa os dados estáticos)
const MarketingBanner = () => {
  const { banner, whatsapp } = SCHOOL_INFO;

  if (!banner.ativo) return null;

  const handleAction = () => {
    if (banner.link) {
      window.open(banner.link, '_blank');
    } else {
      // Se não tiver link específico, abre o WhatsApp da escola
      window.open(`https://wa.me/${whatsapp}?text=Olá, gostaria de saber sobre: ${banner.titulo}`, '_blank');
    }
  };

  return (
    <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden animate-fade-in">
      {/* Efeito de fundo */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Destaque
          </span>
          <h3 className="text-xl font-bold mb-1">{banner.titulo}</h3>
          <p className="text-indigo-100 text-sm max-w-md">
            {banner.mensagem}
          </p>
        </div>
        <button
          onClick={handleAction}
          className="bg-white text-indigo-700 font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-indigo-50 transition text-sm whitespace-nowrap"
        >
          {banner.texto_botao}
        </button>
      </div>
    </div>
  );
};

export default function MeusFilhos() {
  const [filhos, setFilhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Recupera usuário logado
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // Upload de foto
  // =========================
  async function handleUploadFoto(e, alunoId) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("foto", file);

    try {
      await api.patch(`/alunos/${alunoId}/foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { data } = await api.get("/alunos/meus-filhos");
      setFilhos(data);
    } catch (error) {
      console.error("Erro foto:", error);
    }
  }

  // =========================
  // Buscar filhos (Apenas filhos via API)
  // =========================
  useEffect(() => {
    async function loadFilhos() {
      try {
        setLoading(true);
        const { data } = await api.get("/alunos/meus-filhos");
        setFilhos(data);
      } catch (error) {
        if (error.response?.status === 401) {
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
    if (window.confirm("Deseja sair do portal?")) {
      localStorage.clear();
      navigate("/login");
    }
  }

  // Função WhatsApp (Usa a constante)
  function openSecretaria() {
    window.open(`https://wa.me/${SCHOOL_INFO.whatsapp}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* HEADER - Agora usa SCHOOL_INFO */}
      <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo com as iniciais definidas no config */}
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-200">
              {SCHOOL_INFO.logo_texto}
            </div>
            <div>
              {/* Nome da Escola definido no config */}
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                {SCHOOL_INFO.nome}
              </h1>
              <p className="text-xs text-slate-500">Portal do Responsável</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right pr-4 border-r border-slate-200">
              <p className="text-sm font-bold text-slate-700">Olá, {user.nome?.split(" ")[0]}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 transition" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Banner Estático Importado */}
        <MarketingBanner />

        {/* Título */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-cyan-600" /> Área do Aluno
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-cyan-600"></div>
          </div>
        ) : filhos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-dashed border-slate-300">
            <User className="text-slate-300 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Nenhum aluno encontrado</h3>
            <p className="text-slate-500 text-sm mt-2">Entre em contato com a secretaria.</p>
            <button onClick={openSecretaria} className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-full text-sm font-medium hover:bg-cyan-700 transition">
              Falar com Secretaria
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filhos.map((filho) => (
              <div
                key={filho.id}
                className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-cyan-100 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex items-start gap-5 relative z-10">
                  {/* FOTO */}
                  <div className="relative shrink-0">
                    <div
                      className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm group-hover:ring-2 ring-cyan-200 transition-all"
                      onClick={() => document.getElementById(`foto-${filho.id}`).click()}
                    >
                      {filho.foto_url ? (
                        <img src={`${filho.foto_url}?t=${Date.now()}`} alt={filho.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white w-6 h-6" />
                      </div>
                    </div>
                    <input type="file" id={`foto-${filho.id}`} hidden accept="image/*" onChange={(e) => handleUploadFoto(e, filho.id)} />
                  </div>

                  {/* DADOS */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">{filho.nome}</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <GraduationCap size={12} className="text-cyan-500" />
                        {filho.serie || "Série não def."}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <CalendarDays size={12} className="text-cyan-500" />
                        {filho.turno || "Turno não def."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AÇÕES */}
                <div className="mt-6 pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
                  <button
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition"
                    onClick={openSecretaria}
                  >
                    <MessageCircle size={14} />
                    Secretaria
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-100 hover:bg-cyan-700 transition"
                    onClick={() => navigate(`/meus-filhos/diario/${filho.id}`)}
                  >
                    Ver Diário
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-slate-400 text-xs">
        <p>&copy; {new Date().getFullYear()} {SCHOOL_INFO.nome}.</p>
      </footer>
    </div>
  );
}