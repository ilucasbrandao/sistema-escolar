import { Button } from "./components/Button";
import {
    Container,
    TitleH1,
    TitleH3
} from "./components/Container";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";

export default function App() {
    const navigate = useNavigate();

    const handleClick = (label) => navigate(`/${label}`);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    return (
        <Container>
            <TitleH1>Reforço Escolar Tia Jeane</TitleH1>
            <TitleH3>Dashboard</TitleH3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                <Button variant="blue" onClick={() => handleClick("alunos")}>Alunos</Button>
                <Button variant="green" onClick={() => handleClick("professores")}>Professores</Button>
                <Button variant="purple" onClick={() => handleClick("gestao-financeira")}>Gestão Financeira</Button>
                <Button variant="yellow" onClick={() => handleClick("notificacoes")}>Notificações</Button>
                <Button variant="pink" onClick={() => handleClick("gerar-relatorio")}>Gerar Relatório</Button>
                <Button variant="red" onClick={handleLogout}>Logout</Button>
            </div>

            <Footer />
        </Container>
    );
}
