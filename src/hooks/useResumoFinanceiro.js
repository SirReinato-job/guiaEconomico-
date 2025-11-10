// hooks/useResumoFinanceiro.js
import { useSaldo } from "../context/SaldoContext";
import { useGastos } from "../context/GastosContext";
import { useEssencial } from "../context/EssencialContext";

export function useResumoFinanceiro() {
    const { saldo } = useSaldo();
    const { getFaturaTotalCartao } = useGastos();

    const totalReceitas = saldo.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
    );

    const { essenciais } = useEssencial();

    const totalEssenciais = essenciais.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
    );

    const totalGastos = getFaturaTotalCartao();
    const totalGeralGastos = totalGastos + totalEssenciais;

    const saldoLiquido = totalReceitas - totalGeralGastos;

    return {
        totalReceitas: totalReceitas.toFixed(2),
        totalGastos: totalGastos.toFixed(2),
        saldoLiquido: saldoLiquido.toFixed(2),
        totalGeralGastos: totalGeralGastos.toFixed(2),
    };
}
