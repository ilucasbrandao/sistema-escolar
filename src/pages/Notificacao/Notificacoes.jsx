import { useState, useEffect } from "react";
import api from "../../services/api";
import { Container, Title, Paragraph } from "../../components/Container";
import { formatarParaBRL } from "../../utils/format";
import dayjs from "dayjs";
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Notificacoes() {
    const navigate = useNavigate();
    const [inadimplentes, setInadimplentes] = useState([]);
    const [mes, setMes] = useState(dayjs().month() + 1);
    const [ano, setAno] = useState(dayjs().year());

    useEffect(() => {
        const carregar = async () => {
            try {
                const { data } = await api.get("/notificacao", {
                    params: { mes, ano },
                });
                setInadimplentes(data.inadimplentes);
            } catch (err) {
                console.error("Erro ao carregar inadimplentes:", err);
            }
        };
        carregar();
    }, [mes, ano]);

    return (
        <Container>
            <Button onClick={() => navigate("/")}>
                <ChevronLeftIcon className="w-5 h-5" /> Voltar
            </Button>
            <Title level={1} className="text-2xl font-bold text-slate-800 mb-4">
                Notificações
            </Title>
            <Title level={2}>Alunos Inadimplentes - {dayjs(`${ano}-${mes}-01`).format("MMMM [de] YYYY")}</Title>
            <ul className="mt-4 divide-y divide-slate-200 text-sm text-slate-700">
                {inadimplentes.length === 0 ? (
                    <li className="py-2 italic text-slate-500">Todos os alunos estão em dia 🎉</li>
                ) : (
                    inadimplentes.map((a) => (
                        <li key={a.id} className="flex justify-between py-2">
                            <span>{a.nome}</span>
                            <span className="font-semibold">{formatarParaBRL(a.valor_mensalidade)}</span>
                        </li>
                    ))
                )}
            </ul>
        </Container>
    );
}
