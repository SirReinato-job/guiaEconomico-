import { useGastos } from "../context/GastosContext";

export function useResumoEvitaveis() {
    const { gastos } = useGastos();

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const agruparPorNome = gastos.reduce((acc, gasto) => {
        const { tipo, categoria, valor, data } = gasto;
        const dataGasto = new Date(data);

        const isDesejo = tipo === "Desejo";
        const isDoMes =
            dataGasto.getMonth() === mes && dataGasto.getFullYear() === ano;

        if (isDesejo && isDoMes) {
            if (acc[categoria]) {
                acc[categoria] += parseFloat(valor);
            } else {
                acc[categoria] = parseFloat(valor);
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
