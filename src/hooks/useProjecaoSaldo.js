import { useSaldo } from "../context/SaldoContext";
import { useGastos } from "../context/GastosContext";
import { useEssencial } from "../context/EssencialContext";
import { getProximosMeses } from "../utils/proximoMesUtils";

export function useProjecaoSaldo(qtd = 3) {
    const { saldo } = useSaldo();
    const { gastos } = useGastos();
    const { essenciais } = useEssencial();

    const meses = getProximosMeses(qtd);

    const dados = meses.map(({ mes, ano, mesIndex }) => {
        const entradas = saldo
            .filter((item) => {
                const data = new Date(item.data);
                return (
                    data.getMonth() === mesIndex && data.getFullYear() === ano
                );
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        const saidas = gastos
            .filter((item) => {
                const data = new Date(item.data);
                return (
                    data.getMonth() === mesIndex && data.getFullYear() === ano
                );
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        const essenciaisTotal = essenciais
            .filter((item) => {
                const data = new Date(item.data);
                return (
                    data.getMonth() === mesIndex && data.getFullYear() === ano
                );
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        const valor = entradas - (saidas + essenciaisTotal);

        return { mes, valor };
    });

    return Array.isArray(dados) ? dados : [];
}
