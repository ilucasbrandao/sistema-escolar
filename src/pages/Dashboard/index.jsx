import { useState, useEffect } from "react";
import api from "../../services/api";
import { Container, Title, Paragraph } from "../../components/Container";
import { Button } from "../../components/Button";
import { ChevronLeftIcon, UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InfoCard } from "../../components/Cards";
import { formatarParaBRL } from "../../utils/format";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export function Dashboard() {
    const [ano, setAno] = useState(dayjs().year());
    const [mes, setMes] = useState(dayjs().month() + 1);
    const navigate = useNavigate();
    const [dados, setDados] = useState(null);

    const carregarDashboard = async () => {
        try {
            const { data } = await api.get("/dashboard", {
                params: { mes, ano },
            });
            setDados(data);
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
        }
    };

    useEffect(() => {
        carregarDashboard();
    }, [mes, ano]);

    const alterarMes = (delta) => {
        const novo = dayjs(`${ano}-${mes}-01`).add(delta, "month");
        setMes(novo.month() + 1);
        setAno(novo.year());
    };

    if (!dados) return <Paragraph>Carregando dashboard...</Paragraph>;

    return (
        <Container>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => navigate("/")}>
                    <ChevronLeftIcon className="w-5 h-5" /> Voltar
                </Button>
                <Title level={1} className="text-2xl font-bold text-slate-800">
                    Dashboard
                </Title>
                <Button onClick={() => navigate("/alunos/cadastrar")}>
                    <UserRoundPlus className="w-5 h-5" />
                </Button>
            </div>

            {/* Mês atual + navegação */}
            <div className="text-center">
                <Paragraph muted className="text-sm text-slate-600">
                    Relatório de {dayjs(`${ano}-${mes}-01`).format("MMMM [de] YYYY")}
                </Paragraph>
            </div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <Button onClick={() => alterarMes(-1)}>← Mês anterior</Button>
                    <Button onClick={() => alterarMes(1)}>Próximo mês →</Button>
                </div>
                <Button
                    variant="danger"
                    size="md"
                    onClick={async () => {
                        const senhaCorreta = "JulianneKelly2025";
                        const senha = prompt("Digite a senha para fechar o caixa:");

                        if (senha !== senhaCorreta) {
                            alert("Senha incorreta. Fechamento cancelado.");
                            return;
                        }

                        try {
                            const { data } = await api.post("/fechar-caixa-mes", {
                                senha,
                                mes,
                                ano,
                            });

                            alert(
                                `✅ Mês fechado com sucesso!\nUsuário: ${data.fechamento.usuario
                                }\nSaldo final: ${formatarParaBRL(data.fechamento.saldo_final)}`
                            );
                            carregarDashboard();
                        } catch (error) {
                            alert("❌ Erro ao fechar mês. Tente novamente.");
                        }
                    }}
                >
                    Fechar Mês de {dayjs(`${ano}-${mes}-01`).format("MMMM")}
                </Button>

                <Button
                    variant="pastelGreen"
                    size="md"
                    onClick={() => navigate(`/relatorio?mes=${mes}&ano=${ano}`)}
                >
                    Ver Relatório de {dayjs(`${ano}-${mes}-01`).format("MMMM [de] YYYY")}
                </Button>

            </div>

            {/* Indicadores Gerais */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <InfoCard title="Alunos Ativos" value={dados.alunos_ativos} icon="👨‍🎓" />
                <InfoCard
                    title="Professores Ativos"
                    value={dados.professores_ativos}
                    icon="👩‍🏫"
                />
                <InfoCard
                    title={`Saldo de Caixa: ${dayjs(`${ano}-${mes}-01`).format(
                        "MMMM [de] YYYY"
                    )}`}
                    value={formatarParaBRL(dados.saldo_caixa)}
                    icon="💰"
                    highlight
                />
            </section>

            {/* Dados Operacionais */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                {/* Aniversariantes */}
                <div className="bg-white rounded-md shadow-sm p-3">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Aniversariantes do Mês 🎂</h4>
                    <ul className="divide-y divide-slate-200 text-sm text-slate-600">
                        {dados.aniversariantes.length === 0 ? (
                            <li className="py-2 text-slate-500 italic">Nenhum aniversariante este mês.</li>
                        ) : (
                            dados.aniversariantes.map((a) => (
                                <li key={a.nome} className="flex justify-between py-1">
                                    <span>{a.nome}</span>
                                    <span className="font-semibold">{dayjs(a.data_nascimento).format("DD/MM")}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Alunos por Turno */}
                <div className="bg-white rounded-md shadow-sm p-3">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Alunos por Turno</h4>
                    <ul className="divide-y divide-slate-200 text-sm text-slate-600">
                        {Object.entries(dados.alunos_por_turno).map(([turno, qtd]) => (
                            <li key={turno} className="flex justify-between py-1">
                                <span>{turno}</span>
                                <span className="font-semibold">{qtd}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>


            {/* Botão para fechamento do caixa */}
            <div className="mb-6 space-y-2"></div>

            {/* Previsões Financeiras */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-6">

                <InfoCard
                    title="Previsão Financeira"
                    value={
                        <>
                            <div className="text-sm text-green-700">
                                📈 Mensalidades: {formatarParaBRL(dados.saldo_previsto_mensalidades)}
                            </div>
                            <div className="text-sm text-red-700">
                                📉 Salários: {formatarParaBRL(dados.saldo_previsto_salarios)}
                            </div>
                        </>
                    }
                    icon="📊"
                    highlight
                />

                <InfoCard
                    title="Novos Matriculados no Mês"
                    value={dados.matriculados_mes_atual}
                    icon="📝"
                />
            </section>
            {/* Inadimplentes do mês */}
            <section className="bg-white rounded-md shadow-sm p-4 mb-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Alunos Inadimplentes no Mês 📌
                </h4>
                <ul className="divide-y divide-slate-200 text-sm text-slate-600">
                    {dados.inadimplentes.length === 0 ? (
                        <li className="py-2 text-slate-500 italic">
                            Todos os alunos estão em dia 🎉
                        </li>
                    ) : (
                        dados.inadimplentes.map((aluno) => (
                            <li key={aluno.id} className="flex justify-between py-1">
                                <span>{aluno.nome}</span>
                                <span className="font-semibold">
                                    {formatarParaBRL(aluno.valor_mensalidade)}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </Container>
    );
}
