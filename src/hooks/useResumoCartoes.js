import { useGastos } from "../context/GastosContext";

export function useResumoCartoes(ciclo = "atual") {
    const { getFaturaPorCartao, getFaturaTotalCartao } = useGastos();

    const totaisPorCartao = getFaturaPorCartao(ciclo);
    const nomeCartao = Object.keys(totaisPorCartao);
    const valorPorCartao = Object.values(totaisPorCartao).map(
        (valor) => `R$ ${valor.toFixed(2)}`
    );
    const valorTotal = `R$ ${getFaturaTotalCartao(ciclo).toFixed(2)}`;

    return {
        nomeCartao,
        valorPorCartao,
        valorTotal,
        totaisPorCartao,
    };
}
