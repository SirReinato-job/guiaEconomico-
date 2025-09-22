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

// Valores ideais e atuais
const ideal = [50, 30, 20];
const atual = [45, 37, 18];

// Definir cor
const getColor = (atual, ideal) => {
    const diff = atual - ideal;
    if (diff > 5) return "#dc3545";
    return "#28a745";
};

// Gerar array de cores para cada barra
const atualColors = atual.map((valor, i) => getColor(valor, ideal[i]));

const data = {
    labels: ["Necessidades", "Desejos", "Poupança"],
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
            font: {
                weight: "bold",
            },
            formatter: (value) => `${value}%`,
        },
    },
};

export default function GraficoComparativo() {
    return <Bar data={data} options={options} />;
}
