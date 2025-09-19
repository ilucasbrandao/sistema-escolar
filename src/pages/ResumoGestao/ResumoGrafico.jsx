import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { formatarParaBRL } from "../../utils/format";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function ResumoGrafico({ entradas, saidas, saldo }) {
    const data = {
        labels: ["Entradas", "Saídas", "Saldo"],
        datasets: [
            {
                label: "R$",
                data: [entradas, saidas, saldo],
                backgroundColor: [
                    "rgba(34,197,94,0.6)", // verde
                    "rgba(239,68,68,0.6)", // vermelho
                    saldo >= 0 ? "rgba(59,130,246,0.6)" : "rgba(234,179,8,0.6)", // azul ou amarelo
                ],
                borderRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => formatarParaBRL(context.raw),
                },
            },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="mb-6">
            <Bar data={data} options={options} />
        </div>
    );
}
