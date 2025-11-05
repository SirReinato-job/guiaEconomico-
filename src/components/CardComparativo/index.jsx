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
import { useGastos } from "../../context/GastosContext";
import { useSaldo } from "../../context/SaldoContext";

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
    const { getEssenciais, getLivres, getInvestimentos } = useGastos();
    const { getSalarioDoMes } = useSaldo();

    const salario = parseFloat(getSalarioDoMes());

    const calcularPercentual = (valor) =>
        salario > 0 ? ((valor / salario) * 100).toFixed(0) : 0;

    const atual = [
        calcularPercentual(getEssenciais()),
        calcularPercentual(getLivres()),
        calcularPercentual(getInvestimentos()),
    ];

    const ideal = [50, 30, 20];

    const getColor = (atual, ideal) => {
        const diff = atual - ideal;
        return diff > 5 ? "#dc3545" : "#28a745";
    };

    const atualColors = atual.map((valor, i) =>
        getColor(parseFloat(valor), ideal[i])
    );

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
                font: { weight: "bold" },
                formatter: (value) => `${value}%`,
            },
        },
    };

    return <Bar data={data} options={options} />;
}
