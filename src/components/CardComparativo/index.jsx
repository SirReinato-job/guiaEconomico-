import styled from "styled-components";
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

    const getColor = (atualVal, idealVal) => {
        const diff = atualVal - idealVal;
        return diff > 5 ? "#ef4444" : "#10b981";
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
                backgroundColor: "rgba(59, 130, 246, 0.85)",
                hoverBackgroundColor: "#3b82f6",
                borderRadius: 6,
                borderSkipped: false,
                categoryPercentage: 0.75,
                barPercentage: 0.85,
            },
            {
                label: "Atual",
                data: atual,
                backgroundColor: atualColors,
                hoverBackgroundColor: atualColors,
                borderRadius: 6,
                borderSkipped: false,
                categoryPercentage: 0.75,
                barPercentage: 0.85,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 34,
                bottom: 4,
                left: 4,
                right: 4,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grace: "30%",
                ticks: {
                    color: "#64748b",
                    font: { size: 11 },
                    callback: (value) => `${value}%`,
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.05)",
                },
                border: {
                    display: false,
                },
            },
            x: {
                grid: { display: false },
                border: {
                    display: false,
                },
                ticks: {
                    color: "#e2e8f0",
                    font: { size: 12, weight: "bold" },
                },
            },
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#cbd5e1",
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 14,
                    font: {
                        size: 12,
                        weight: "500",
                    },
                },
            },
            tooltip: {
                backgroundColor: "#0f172a",
                titleColor: "#f8fafc",
                bodyColor: "#cbd5e1",
                borderColor: "rgba(255, 255, 255, 0.12)",
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
                usePointStyle: true,
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
                color: "#f8fafc",
                anchor: "end",
                align: "top",
                offset: 3,
                font: {
                    weight: "bold",
                    size: 11,
                },
                textAlign: "center",
                formatter: (value, context) => {
                    const isAtual = context.dataset.label === "Atual";
                    const idx = context.dataIndex;
                    const valorReal = isAtual
                        ? (totais[idx] || 0)
                        : (salario * ((ideal[idx] || 0) / 100));

                    const casasDecimais = valorReal % 1 === 0 ? 0 : 2;
                    const realFormatado = valorReal.toLocaleString("pt-BR", {
                        minimumFractionDigits: casasDecimais,
                        maximumFractionDigits: 2,
                    });

                    return [`R$ ${realFormatado}`, `${value}%`];
                },
            },
        },
    };

    return (
        <ContainerGrafico>
            <Bar data={data} options={options} />
        </ContainerGrafico>
    );
}

const ContainerGrafico = styled.div`
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    min-height: 160px;
    margin-top: 6px;
`;
