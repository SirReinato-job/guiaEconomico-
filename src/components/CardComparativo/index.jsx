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
    const { percentuais } = useResumoComparativo();

    const atual = percentuais;
    const ideal = [50, 30, 20];

    const getColor = (atual, ideal) => {
        const diff = atual - ideal;
        return diff > 5 ? "#dc3545" : "#28a745";
    };

    const atualColors = atual.map((valor, i) =>
        getColor(parseFloat(valor), ideal[i])
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
        plugins: {
            legend: { position: "bottom" },
            datalabels: {
                color: "#ffffff",
                anchor: "center",
                align: "center",
                font: { weight: "bold" },
                formatter: (value) => `${value}%`,
            },
        },
    };

    return <Bar data={data} options={options} />;
}
