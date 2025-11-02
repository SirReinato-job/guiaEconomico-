import { useEffect, useState } from "react";
// import { getSaldoPorDia } from '../../services/saldoService';
import styled from "styled-components";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
    },
    scales: {
        x: {
            grid: { display: false },
        },
        y: {
            grid: { display: false },
            ticks: {
                callback: (value) => `R$ ${value.toFixed(2)}`,
            },
        },
    },
};

export function CardSaldoGrafico() {
    const [graficoData, setGraficoData] = useState(null);

    useEffect(() => {
        async function carregarDados() {
            // const json = await getSaldoPorDia();

            const dataFormatada = {
                // labels: json.labels,
                datasets: [
                    {
                        label: "Saldo",
                        // data: json.saldoPorDia,
                        fill: true,
                        borderColor: "rgba(130, 10, 209, 1)",
                        backgroundColor: "rgba(27, 4, 42, 0.2)",
                        tension: 0.4,
                    },
                ],
            };

            setGraficoData(dataFormatada);
        }

        carregarDados();
    }, []);

    return (
        <CardContainer>
            <GraficoWrapper>
                {graficoData ? (
                    <Line data={graficoData} options={options} />
                ) : (
                    <p>Carregando...</p>
                )}
            </GraficoWrapper>
        </CardContainer>
    );
}

const CardContainer = styled.div`
    border-radius: 16px;
    width: 100%;
    box-sizing: border-box;
`;

const GraficoWrapper = styled.div`
    height: 70px;
    width: 100%;
    canvas {
        max-height: 100%;
    }
`;
