import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Eye, EyeOff, Heart, Mail, Lock, Loader2 } from "lucide-react";
import logo from "../../assets/logo.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      setMsg("Preencha e-mail e senha para continuar.");
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const res = await api.post("/login", { email, senha });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.Authorization = `Bearer ${token}`;

      navigate(user.role === "responsavel" ? "/meus-filhos" : "/");
    } catch (err) {
      if (!err?.response) {
        setMsg("Não foi possível conectar ao servidor.");
      } else if (err.response.status === 401) {
        setMsg("E-mail ou senha incorretos.");
      } else {
        setMsg("Erro inesperado ao acessar o sistema.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F9F5EF] font-sans">

      {/* Background Decorativo Suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9F5EF] via-[#EAF4F6] to-[#e0f2f5] z-0"></div>

      {/* Formas Animadas (Blur) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4AA3B8]/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#5A3A1E]/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 sm:p-10">

          {/* Cabeçalho do Card */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 mb-4 rounded-full bg-white shadow-sm p-1 flex items-center justify-center overflow-hidden border-2 border-[#EAF4F6]">
              <img
                src={logo}
                alt="Espaço ao Pé da Letra"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-2xl font-bold text-[#5A3A1E]">
              Bem-vindo(a)
            </h1>
            <p className="text-sm text-[#4AA3B8] font-medium mt-1">
              Portal Espaço ao Pé da Letra
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                E-mail
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4AA3B8] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4AA3B8]/50 focus:border-[#4AA3B8] transition-all"
                />
              </div>
            </div>

            {/* Input Senha */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                Senha
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4AA3B8] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4AA3B8]/50 focus:border-[#4AA3B8] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#5A3A1E] p-1 rounded-md transition-colors"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {msg && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm text-center font-medium animate-fade-in">
                {msg}
              </div>
            )}

            {/* Botão de Login */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold tracking-wide text-white shadow-lg shadow-[#4AA3B8]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0
                ${isLoading
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-[#4AA3B8] hover:bg-[#3c8d9e]"
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin" /> Entrando...
                </div>
              ) : (
                "Acessar Portal"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 mb-1">
              Educação que cresce com afeto
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-[#5A3A1E]/60 font-medium">
              Desenvolvido por <a href="https://github.com/ilucasbrandao" target="_blank" rel="noopener noreferrer">Lucas Brandão</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}