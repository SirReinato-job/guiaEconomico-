import { useSaldo } from "../context/SaldoContext";
import { useGastos } from "../context/GastosContext";
import { useEssencial } from "../context/EssencialContext";
import { getProximosMeses } from "../utils/proximoMesUtils";

export function useProjecaoSaldo(qtd = 3) {
    const { saldo, getSalarioDoMes } = useSaldo();
    const { gastos } = useGastos();
    const { essenciais } = useEssencial();

    const meses = getProximosMeses(qtd);

    const dados = meses.map(({ mes, ano, mesIndex }) => {
        // salário recorrente ou ajustado
        const salario = getSalarioDoMes(ano, mesIndex);

        // entradas extras (receitas além do salário)
        const entradasExtras = saldo
            .filter((item) => {
                const data = new Date(item.data);
                return (
                    data.getMonth() === mesIndex && data.getFullYear() === ano
                );
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        // saídas (gastos com cartão)
        const saidas = gastos
            .filter((item) => {
                const data = new Date(item.data);
                return (
                    data.getMonth() === mesIndex && data.getFullYear() === ano
                );
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        // essenciais
        const essenciaisTotal = essenciais
            .filter((item) => {
                const data = new Date(item.data);
                return (
                    data.getMonth() === mesIndex && data.getFullYear() === ano
                );
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        // saldo líquido do mês
        const valor = salario + entradasExtras - (saidas + essenciaisTotal);

        return { mes, valor };
    });

    return Array.isArray(dados) ? dados : [];
}
