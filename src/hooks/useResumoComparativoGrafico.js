import { useGastos } from "../context/GastosContext";
import { useSaldo } from "../context/SaldoContext";
import { useResumoEssenciais } from "./useResumoEssencial";
import { parseCurrency } from "../utils/currencyUtils";

export function useResumoComparativo(ciclo = "atual") {
    const { gastos, getIntervaloFatura } = useGastos();
    const { getSalarioDoMes } = useSaldo();
    const { destaque: totalEssenciaisFormatado } = useResumoEssenciais();

    const salario = parseCurrency(getSalarioDoMes());
    const totalEssenciais = parseCurrency(totalEssenciaisFormatado);

    const categorias = ["Essencial", "Desejo", "Poupança"];

    const totais = categorias.map((categoria) => {
        let total = 0;

        gastos.forEach((gasto) => {
            if (gasto.tipo !== categoria) return;

            const dataGasto = new Date(gasto.data);
            const { inicio, fim } = getIntervaloFatura(
                gasto.cartao,
                new Date(),
                ciclo
            );

            if (dataGasto >= inicio && dataGasto <= fim) {
                total += parseCurrency(gasto.valor);
            }
        });

        if (categoria === "Essencial") {
            total += totalEssenciais;
        }

        return total;
    });

    const percentuais = totais.map((valor) =>
        salario > 0 ? ((valor / salario) * 100).toFixed(0) : "0"
    );

    return {
        totais,
        percentuais: percentuais.map((p) => parseCurrency(p)),
        salario,
    };
}
