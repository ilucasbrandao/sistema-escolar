import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../../services/login.js";
import { TopBackground } from "../../components/TopBackground.jsx";
import { Button } from "../../components/Button.jsx"

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setMsg("");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginService.post("/login", {
        email,
        password: senha,
      });

      // Pega o que o backend realmente manda
      const { token, usuario } = res.data;

      // DICA DE OURO: No futuro, mova isso para um AuthContext
      localStorage.setItem("token", token);

      // Convertendo objeto para string antes de salvar (erro comum salvar [Object object])
      localStorage.setItem("user", JSON.stringify(usuario));

      navigate("/"); // Redireciona para home/dashboard
    } catch (err) {
      console.error(err); // Bom para debug
      // Tratamento robusto de erro
      if (!err?.response) {
        setMsg("Erro ao conectar com o servidor.");
      } else if (err.response?.status === 401) {
        setMsg("Email ou senha inválidos.");
      } else {
        setMsg(err.response?.data?.message || "Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false); // <--- Libera o botão (se deu erro)
    }

  };

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-indigo-900 min-h-screen flex flex-col items-center justify-center p-6">
      <TopBackground />

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Acesse sua conta
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Essas credenciais serão usadas para acessar a plataforma
        </p>

        {/* Campo Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Campo Senha */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Botão com Feedback Visual */}
        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'}
          `}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        {msg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-sm">
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}
