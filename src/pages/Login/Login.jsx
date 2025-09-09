import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "../../services/login.js";
import {
  Container,
  TopBackground,
  Form,
  Title,
  ContainerInput,
  Input,
  Button,
  InputLabel,
  ErrorMessage,
} from "./styles";
import LogoImage from "../../assets/ERP.jpg";

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
    <Container>
      <TopBackground>
        <img src={LogoImage} alt="Logo da empresa" />
      </TopBackground>

      <Form onSubmit={handleLogin}>
        <Title>Digite suas credenciais</Title>
        <p>Essas credenciais serão usadas para acessar a plataforma</p>

        <ContainerInput>
          <div>
            <InputLabel>E-mail <span>*</span></InputLabel>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={{ color: "#fff" }}
            />
          </div>

          <div>
            <InputLabel>Senha <span>*</span></InputLabel>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ color: "#fff" }}
            />
          </div>
        </ContainerInput>

        <Button type="submit">Entrar</Button>
        {msg && <ErrorMessage>{msg}</ErrorMessage>}
      </Form>
    </Container>
  );
}
