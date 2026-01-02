import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/Button";
import { Eye, EyeOff, Heart } from "lucide-react";
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F9F5EF] via-[#EAF4F6] to-[#F3EFE7]">

      {/* Formas decorativas animadas */}
      <div className="absolute w-[420px] h-[420px] bg-cyan-200/30 rounded-full blur-3xl -top-32 -left-32 animate-pulse"></div>
      <div className="absolute w-[360px] h-[360px] bg-yellow-200/30 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>

      {/* Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl px-8 py-10 border border-white"
      >
        {/* LOGO + MARCA */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex flex-col items-center">
            <img
              src={logo}
              alt="Espaço ao Pé da Letra"
              className="h-32 mb-2"
            />
          </div>

          <h1 className="text-2xl font-extrabold tracking-wide text-[#5A3A1E]">
            Espaço ao Pé da Letra
          </h1>
          <p className="text-sm text-[#4AA3B8] font-medium mt-1">
            Educação que cresce com afeto
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#5A3A1E] mb-1">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* SENHA */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#5A3A1E] mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-400 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#5A3A1E]"
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* BOTÃO */}
        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-xl font-bold tracking-wide text-white transition-all
            ${isLoading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#4AA3B8] to-[#3C8FA2] hover:scale-[1.03] shadow-lg"
            }
          `}
        >
          {isLoading ? "Entrando..." : "Entrar no ambiente"}
        </Button>

        {/* ERRO */}
        {msg && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm text-center">
            {msg}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1">
            Desenvolvido com <Heart size={12} className="text-red-400" /> para acompanhar cada fase da infância
          </p>
          <p className="font-medium">
            © {new Date().getFullYear()} Espaço ao Pé da Letra
          </p>
        </div>
      </form>
    </div>
  );
}
