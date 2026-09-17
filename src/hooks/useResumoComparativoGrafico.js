import { useGastos } from "../context/GastosContext";
import { useSaldo } from "../context/SaldoContext";
import { useResumoEssenciais } from "./useResumoEssencial";
import { parseCurrency } from "../utils/currencyUtils";

export function useResumoComparativo(ciclo = "atual") {
    const { gastos, getIntervaloFatura } = useGastos();
    const { saldo, getSalarioDoMes } = useSaldo();
    const { destaque: totalEssenciaisFormatado } = useResumoEssenciais();

    // Obtém o último salário registrado em saldo
    const ultimosSalarios = (saldo || [])
        .filter((item) => {
            const tipo = item.tipo?.toLowerCase();
            return tipo === "salario" || tipo === "salário";
        })
        .sort((a, b) => {
            const dataA = a.data ? new Date(a.data.includes("T") ? a.data : `${a.data}T00:00:00`) : 0;
            const dataB = b.data ? new Date(b.data.includes("T") ? b.data : `${b.data}T00:00:00`) : 0;
            return dataB - dataA;
        });

    const ultimoSalario =
        ultimosSalarios.length > 0
            ? parseCurrency(ultimosSalarios[0].valor)
            : 0;

    const hoje = new Date();
    const salarioConfigurado = getSalarioDoMes
        ? parseCurrency(getSalarioDoMes(hoje.getFullYear(), hoje.getMonth()))
        : 0;

    const salario = salarioConfigurado > 0 ? salarioConfigurado : ultimoSalario;
    const totalEssenciais = parseCurrency(totalEssenciaisFormatado);

    const normalizarTipo = (tipo = "") => {
        const t = (tipo || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
        if (t.includes("essenci") || t.includes("educa")) return "Essencial";
        if (t.includes("desejo")) return "Desejo";
        if (t.includes("poup") || t.includes("invest")) return "Poupança";
        return tipo;
    };

    const parseDataSegura = (dataStr) => {
        if (!dataStr) return null;
        return new Date(dataStr.includes("T") ? dataStr : `${dataStr}T12:00:00`);
    };

    const categorias = ["Essencial", "Desejo", "Poupança"];

    const totais = categorias.map((categoria) => {
        let total = 0;

        (gastos || []).forEach((gasto) => {
            const tipoGasto = normalizarTipo(gasto.tipo);
            if (tipoGasto !== categoria) return;

            const dataGasto = parseDataSegura(gasto.data);
            if (!dataGasto) return;

            const { inicio, fim } = getIntervaloFatura(
                gasto.cartao,
                new Date(),
                ciclo
            );

            if (inicio && fim && dataGasto >= inicio && dataGasto <= fim) {
                total += parseCurrency(gasto.valor);
            }
        });

        if (categoria === "Essencial") {
            total += totalEssenciais;
        }

        return total;
    });

    const percentuais = totais.map((valor) =>
        salario > 0 ? Number(((valor / salario) * 100).toFixed(0)) : 0
    );

    return {
        totais,
        percentuais,
        salario,
    };
}
