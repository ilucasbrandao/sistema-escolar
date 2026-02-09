import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  LogOut,
  User,
  ArrowRight,
  Camera,
  GraduationCap,
  CalendarDays,
  MessageCircle
} from "lucide-react";

// IMPORTANDO AS CONFIGURAÇÕES ESTÁTICAS
import { SCHOOL_INFO } from "../../config/schoolConfig";

// Componente de Banner de Marketing
const MarketingBanner = () => {
  const { banner, whatsapp } = SCHOOL_INFO;

  if (!banner.ativo) return null;

  const handleAction = () => {
    if (banner.link) {
      window.open(banner.link, '_blank');
    } else {
      window.open(`https://wa.me/${whatsapp}?text=Olá, gostaria de saber sobre: ${banner.titulo}`, '_blank');
    }
  };

  return (
    <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden animate-fade-in">
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
  const [uploadingId, setUploadingId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // Upload de foto
  // =========================
  async function handleUploadFoto(e, alunoId) {
    const file = e.target.files[0];
    if (!file) return;

    // Validação simples de tamanho (ex: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A foto deve ter no máximo 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("foto", file);
    setUploadingId(alunoId); // Ativa loading no card específico

    try {
      await api.patch(`/alunos/${alunoId}/foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Recarrega a lista para pegar a nova URL
      const { data } = await api.get("/alunos/meus-filhos");
      setFilhos(data);

    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      alert("Erro ao atualizar a foto. Tente novamente.");
    } finally {
      setUploadingId(null);
    }
  }

  // =========================
  // Buscar filhos
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

  function openSecretaria() {
    window.open(`https://wa.me/${SCHOOL_INFO.whatsapp}`, "_blank");
  }

  // Função auxiliar para disparar o input file sem usar ID
  const triggerFileInput = (alunoId) => {
    const input = document.getElementById(`input-foto-${alunoId}`);
    if (input) input.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-200">
              {SCHOOL_INFO.logo_texto}
            </div>
            <div>
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
        <MarketingBanner />

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
                  {/* ÁREA DA FOTO */}
                  <div className="relative shrink-0">
                    <div
                      className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm group-hover:ring-4 ring-cyan-50 transition-all relative"
                      onClick={() => triggerFileInput(filho.id)}
                    >
                      {uploadingId === filho.id ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-400 border-t-cyan-600"></div>
                        </div>
                      ) : filho.foto_url ? (
                        <img
                          src={`${filho.foto_url}?t=${new Date().getTime()}`}
                          alt={filho.nome}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://placehold.co/100?text=Foto"; }} // Fallback simples
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User size={32} />
                        </div>
                      )}

                      {/* Overlay de Câmera (só aparece se não estiver carregando) */}
                      {uploadingId !== filho.id && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white w-8 h-8 drop-shadow-md" />
                        </div>
                      )}
                    </div>

                    {/* INPUT OCULTO - FORA DA DIV CLICÁVEL VISUALMENTE MAS LOGICAMENTE VINCULADO */}
                    <input
                      type="file"
                      id={`input-foto-${filho.id}`}
                      hidden
                      accept="image/*"
                      onChange={(e) => handleUploadFoto(e, filho.id)}
                    />
                  </div>

                  {/* DADOS */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={filho.nome}>{filho.nome}</h3>
                    <div className="mt-2 space-y-1.5">
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-2 bg-slate-50 py-1 px-2 rounded-lg w-fit">
                        <GraduationCap size={14} className="text-cyan-600" />
                        {filho.serie || "Série não def."}
                      </p>
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-2 bg-slate-50 py-1 px-2 rounded-lg w-fit">
                        <CalendarDays size={14} className="text-cyan-600" />
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
                    <MessageCircle size={16} />
                    Secretaria
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-100 hover:bg-cyan-700 transition"
                    onClick={() => navigate(`/meus-filhos/diario/${filho.id}`)}
                  >
                    Ver Diário
                    <ArrowRight size={16} />
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