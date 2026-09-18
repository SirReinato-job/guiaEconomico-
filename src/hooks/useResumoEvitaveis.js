import { useGastos } from "../context/GastosContext";
import { parseCurrency } from "../utils/currencyUtils";
import { useMes } from "../context/MesContext";

export function useResumoEvitaveis() {
    const { gastos } = useGastos();
    const { mesReferencia } = useMes() || {};

    const dataRef = mesReferencia || new Date();
    const ano = dataRef.getFullYear();
    const mes = dataRef.getMonth();
    const agruparPorNome = (gastos || []).reduce((acc, gasto) => {
        const { tipo, categoria, valor, data, responsavel = "meu" } = gasto;
        if (!data) return acc;

        // Gastos da Mozi não são despesas do usuário
        if (responsavel === "mozi") return acc;

        const tipoNorm = (tipo || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
        const isDesejo = tipoNorm.includes("desejo");

        const dataGasto = new Date(data.includes("T") ? data : `${data}T12:00:00`);
        const isDoMes =
            dataGasto.getMonth() === mes && dataGasto.getFullYear() === ano;

        if (isDesejo && isDoMes) {
            const cat = categoria || "Outros";
            const fator = responsavel === "dividido" ? 0.5 : 1.0;
            const valorNum = parseCurrency(valor) * fator;
            acc[cat] = (acc[cat] || 0) + valorNum;
        }

        return acc;
    }, {});

    const nomesEvitaveis = Object.keys(agruparPorNome);
    const valoresEvitaveis = Object.values(agruparPorNome).map(
        (valor) =>
            `R$ ${valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
    );

    const total = Object.values(agruparPorNome).reduce(
        (acc, val) => acc + val,
        0
    );
    const destaqueEvitaveis = `R$ ${total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

    return {
        nomesEvitaveis,
        valoresEvitaveis,
        destaqueEvitaveis,
        destaque: destaqueEvitaveis,
        nomes: nomesEvitaveis,
        valores: valoresEvitaveis,
    };
}
