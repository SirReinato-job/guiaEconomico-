import { useGastos } from "../context/GastosContext";
import { parseCurrency } from "../utils/currencyUtils";
import { useMes } from "../context/MesContext";

export function useResumoEvitaveis() {
    const { gastos } = useGastos();
    const { mesReferencia } = useMes() || {};

    const dataRef = mesReferencia || new Date();
    const ano = dataRef.getFullYear();
    const mes = dataRef.getMonth();

    const agruparPorNome = gastos.reduce((acc, gasto) => {
        const { tipo, categoria, valor, data } = gasto;
        if (!data) return acc;
        const dataGasto = new Date(data.includes("T") ? data : `${data}T12:00:00`);

        const isDesejo = tipo === "Desejo";
        const isDoMes =
            dataGasto.getMonth() === mes && dataGasto.getFullYear() === ano;

        if (isDesejo && isDoMes) {
            const valorNum = parseCurrency(valor);
            if (acc[categoria]) {
                acc[categoria] += valorNum;
            } else {
                acc[categoria] = valorNum;
            }
        }

        return acc;
    }, {});

    const nomesEvitaveis = Object.keys(agruparPorNome);
    const valoresEvitaveis = Object.values(agruparPorNome).map(
        (valor) => `R$ ${valor.toFixed(2)}`
    );

    const total = Object.values(agruparPorNome).reduce(
        (acc, val) => acc + val,
        0
    );
    const destaqueEvitaveis = `R$ ${total.toFixed(2)}`;

    return {
        nomesEvitaveis,
        valoresEvitaveis,
        destaqueEvitaveis,
    };
}
