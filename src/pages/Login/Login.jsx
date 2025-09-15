import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "../../services/login.js";
import { TopBackground } from "../../components/TopBackground.jsx";
import { DefaultButton } from "../../components/Button.jsx"

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setMsg("Preencha todos os campos");
      return;
    }

    try {
      // ✅ Correção aqui
      const res = await login.post("/login", {
        email,
        password: senha,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", res.data.usuario.email);

      navigate("/"); // Página home
    } catch (err) {
      setMsg(err.response?.data?.message || "Erro no login");
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
          Digite suas credenciais
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Essas credenciais serão usadas para acessar a plataforma
        </p>

        {/* Campo Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        {/* Campo Senha */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Senha <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        {/* Botão */}
        <DefaultButton
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Entrar
        </DefaultButton>

        {/* Mensagem de erro */}
        {msg && (
          <p className="text-red-600 text-sm text-center font-medium">{msg}</p>
        )}
      </form>
    </div>
  );
}
