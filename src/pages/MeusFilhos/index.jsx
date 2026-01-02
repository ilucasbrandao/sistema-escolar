import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { LogOut, User, ArrowRight } from "lucide-react";

export default function MeusFilhos() {
  const [filhos, setFilhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // Upload de foto
  // =========================
  async function handleUploadFoto(e, alunoId) {
    console.log("🟡 handleUploadFoto chamado");
    console.log("Aluno ID:", alunoId);

    const file = e.target.files[0];
    console.log("Arquivo selecionado:", file);

    if (!file) {
      console.log("❌ Nenhum arquivo selecionado");
      return;
    }

    const formData = new FormData();
    formData.append("foto", file);

    // 🔍 LOG DO FORMDATA (importante)
    for (let pair of formData.entries()) {
      console.log("FormData:", pair[0], pair[1]);
    }

    try {
      const response = await api.patch(
        `/alunos/${alunoId}/foto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Upload sucesso:", response.data);
    } catch (error) {
      console.error("❌ Erro no upload:", error.response || error);
    }
  }


  // =========================
  // Buscar filhos
  // =========================
  useEffect(() => {
    async function loadFilhos() {
      try {
        const { data } = await api.get("/alunos/meus-filhos");
        setFilhos(data);
      } catch (error) {
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
      {/* ================= HEADER ================= */}
      <header className="bg-gradient-to-r from-cyan-600 to-indigo-900 text-white p-6 shadow-lg mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Olá, {user.nome?.split(" ")[0]}!
            </h1>
            <p className="text-cyan-100 text-sm opacity-90">
              Acompanhe o desenvolvimento escolar
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-full text-sm"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </header>

      {/* ================= CONTEÚDO ================= */}
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
            <p className="text-gray-500 text-lg">
              Nenhum aluno vinculado à sua conta.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Entre em contato com a secretaria para vincular.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filhos.map((filho) => (
              <div
                key={filho.id} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition cursor-pointer group"
              >
                {/* Faixa lateral */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-cyan-500 group-hover:bg-indigo-600 transition-colors" />

                <div className="p-6 pl-8 flex flex-col h-full">
                  {/* HEADER */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-700 transition">
                        {filho.nome}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 font-medium uppercase tracking-wide">
                        {filho.serie || "Série não informada"} •{" "}
                        {filho.turno || "Turno não inf."}
                      </p>
                    </div>

                    {/* AVATAR */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        document
                          .getElementById(`foto-${filho.id}`)
                          .click();
                      }}
                      title="Alterar foto"
                      className="h-14 w-14 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-cyan-400 transition"
                    >
                      {filho.foto_url ? (
                        <img
                          src={`${filho.foto_url}?t=${Date.now()}`}
                          alt={filho.nome}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="text-slate-400" size={26} />
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      id={`foto-${filho.id}`}
                      hidden
                      onChange={(e) =>
                        handleUploadFoto(e, filho.id)
                      }
                    />
                  </div>

                  {/* FOOTER */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-wider">
                      Ativo
                    </span>

                    <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all" onClick={() => navigate(`/meus-filhos/diario/${filho.id}`)}>
                      Ver Diário <ArrowRight size={16} />
                    </span>
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
