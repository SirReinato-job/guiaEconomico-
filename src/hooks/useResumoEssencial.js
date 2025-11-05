import { useEssencial } from "../context/EssencialContext";

export function useResumoEssenciais() {
    const { essenciais } = useEssencial();

    const nomes = essenciais.map((item) => item.tipo);
    const valores = essenciais.map(
        (item) => `R$ ${parseFloat(item.valor).toFixed(2)}`
    );

    const total = essenciais.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
    );

    const destaque = `R$ ${total.toFixed(2)}`;

    return {
        nomes,
        valores,
        destaque,
    };
}
