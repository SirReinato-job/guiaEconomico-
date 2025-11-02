// hooks/useResumoFinanceiro.js
import { useSaldo } from "../context/SaldoContext";
import { useGastos } from "../context/GastosContext";

export function useResumoFinanceiro() {
    const { saldo } = useSaldo();
    const { getFaturaTotalCartao } = useGastos();

    const totalReceitas = saldo.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
    );

    const totalGastos = getFaturaTotalCartao();

    const saldoLiquido = totalReceitas - totalGastos;

    return {
        totalReceitas: totalReceitas.toFixed(2),
        totalGastos: totalGastos.toFixed(2),
        saldoLiquido: saldoLiquido.toFixed(2),
    };
}
