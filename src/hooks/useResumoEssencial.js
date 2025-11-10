import { useEssencial } from "../context/EssencialContext";

export function useResumoEssenciais() {
    const { essenciais } = useEssencial();

    const agruparPorTipo = essenciais.reduce((acc, item) => {
        const tipo = item.tipo;
        const valor = parseFloat(item.valor);

        if (acc[tipo]) {
            acc[tipo] += valor;
        } else {
            acc[tipo] = valor;
        }

        return acc;
    }, {});

    const nomes = Object.keys(agruparPorTipo);
    const valores = Object.values(agruparPorTipo).map(
        (valor) => `R$ ${valor.toFixed(2)}`
    );

    const total = Object.values(agruparPorTipo).reduce(
        (acc, val) => acc + val,
        0
    );
    const destaque = `R$ ${total.toFixed(2)}`;

    return {
        nomes,
        valores,
        destaque,
    };
}
