import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { useResumoComparativo } from "../../hooks/useResumoComparativoGrafico";
import { parseCurrency } from "../../utils/currencyUtils";

// Registrar os componentes e o plugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function GraficoComparativo() {
    const { percentuais, totais = [0, 0, 0], salario = 0 } =
        useResumoComparativo() || {};

    const atual = percentuais || [0, 0, 0];
    const ideal = [50, 30, 20];

    const getColor = (atual, ideal) => {
        const diff = atual - ideal;
        return diff > 5 ? "#dc3545" : "#28a745";
    };

    const atualColors = atual.map((valor, i) =>
        getColor(parseCurrency(valor), ideal[i])
    );

    const data = {
        labels: ["Essencial", "Desejos", "Poupança"],
        datasets: [
            {
                label: "Ideal",
                data: ideal,
                backgroundColor: "#5a8ee0",
            },
            {
                label: "Atual",
                data: atual,
                backgroundColor: atualColors,
            },
        ],
    };

    const options = {
        responsive: true,
        layout: {
            padding: {
                top: 28,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grace: "20%",
                ticks: {
                    color: "#a0aec0",
                    callback: (value) => `${value}%`,
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.08)",
                },
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: "#ffffff",
                    font: { weight: "bold" },
                },
            },
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#ffffff",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const isAtual = context.dataset.label === "Atual";
                        const idx = context.dataIndex;
                        const valorReal = isAtual
                            ? (totais[idx] || 0)
                            : (salario * ((ideal[idx] || 0) / 100));

                        const realFormatado = valorReal.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        });

                        return ` ${context.dataset.label}: R$ ${realFormatado} (${context.raw}%)`;
                    },
                },
            },
            datalabels: {
                color: "#ffffff",
                anchor: "end",
                align: "top",
                offset: 2,
                font: {
                    weight: "bold",
                    size: 10,
                },
                textAlign: "center",
                formatter: (value, context) => {
                    const isAtual = context.dataset.label === "Atual";
                    const idx = context.dataIndex;
                    const valorReal = isAtual
                        ? (totais[idx] || 0)
                        : (salario * ((ideal[idx] || 0) / 100));

                    const realFormatado = valorReal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });

                    return [`R$ ${realFormatado}`, `${value}%`];
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
}
