// hooks/useResumoFinanceiro.js
import { useSaldo } from "../context/SaldoContext";
import { useGastos } from "../context/GastosContext";
import { useEssencial } from "../context/EssencialContext";
import { parseCurrency } from "../utils/currencyUtils";

export function useResumoFinanceiro() {
    const { saldo } = useSaldo();
    const { getFaturaTotalCartao, getGanhosMozi } = useGastos();

    const totalReceitasBase = saldo.reduce(
        (acc, item) => acc + parseCurrency(item.valor),
        0
    );

    const { totalGeral: totalGanhosMozi = 0 } = getGanhosMozi ? getGanhosMozi() : {};
    const totalReceitas = totalReceitasBase + totalGanhosMozi;

    const { essenciais } = useEssencial();

    const totalEssenciais = essenciais.reduce(
        (acc, item) => acc + parseCurrency(item.valor),
        0
    );

    const totalGastos = getFaturaTotalCartao();
    const totalGeralGastos = totalGastos + totalEssenciais;

    const saldoLiquido = totalReceitas - totalGeralGastos;

    return {
        totalReceitas: totalReceitas.toFixed(2),
        totalReceitasBase: totalReceitasBase.toFixed(2),
        totalGanhosMozi: totalGanhosMozi.toFixed(2),
        totalGastos: totalGastos.toFixed(2),
        saldoLiquido: saldoLiquido.toFixed(2),
        totalGeralGastos: totalGeralGastos.toFixed(2),
    };
}
