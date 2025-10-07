import { useState, useEffect } from "react";
import api from "../../services/api";
import { Container, Title, Paragraph } from "../../components/Container";
import { formatarParaBRL } from "../../utils/format";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br'; // importa português
import { Button } from "../../components/Button";
import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

dayjs.locale('pt-br');

export function Notificacoes() {
    const navigate = useNavigate();
    const [inadimplentes, setInadimplentes] = useState([]);
    const [mes, setMes] = useState(dayjs().month() + 1); // 1-12
    const [ano, setAno] = useState(dayjs().year());

    // Carrega inadimplentes sempre que mês ou ano mudam
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

    // Gera array de anos para select (ex: últimos 5 anos até 5 anos à frente)
    const anosDisponiveis = Array.from(
        { length: 11 },
        (_, i) => dayjs().year() - 5 + i
    );

    return (
        <Container>
            {/* Botão voltar */}
            <Button onClick={() => navigate("/")}>
                <ChevronLeftIcon className="w-5 h-5" /> Voltar
            </Button>

            <Title level={1} className="text-2xl font-bold text-slate-800 mb-4">
                Notificações
            </Title>

            {/* Filtros de mês/ano */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <select
                    value={mes}
                    onChange={(e) => setMes(Number(e.target.value))}
                    className="p-2 border rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {dayjs().month(i).format("MMMM")}
                        </option>
                    ))}
                </select>

                <select
                    value={ano}
                    onChange={(e) => setAno(Number(e.target.value))}
                    className="p-2 border rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
                >
                    {anosDisponiveis.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>
            </div>

            <Title level={2}>
                Alunos Inadimplentes - {dayjs(`${ano}-${mes}-01`).format("MMMM [de] YYYY")}
            </Title>

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
