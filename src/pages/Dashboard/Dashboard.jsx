import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TitleH1 } from "./components/Container";
import { Form } from "./components/Form";
import { Button } from "./components/Button";
import api from "./services/api";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const fields = [
        {
            name: "email",
            label: "E-mail",
            placeholder: "Digite seu e-mail",
            type: "email",
        },
        {
            name: "password",
            label: "Senha",
            placeholder: "Digite sua senha",
            type: "password",
        },
    ];

    const handleSubmit = async (data) => {
        try {
            const response = await api.post("/login", data);
            const { token, usuario } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("userEmail", usuario.email);

            alert("Login realizado com sucesso!");
            navigate("/");
        } catch (error) {
            alert("Erro ao fazer login. Verifique suas credenciais.");
            console.error("❌ Erro no login:", error?.response?.data?.message || error.message);
        }
    };

    return (
        <Container>
            <TitleH1>Login</TitleH1>
            <Form
                fields={fields}
                onSubmit={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            />
            <div className="mt-4 text-center text-xs text-gray-500">
                Essas credenciais serão usadas para acessar a plataforma.
            </div>
        </Container>
    );
}
