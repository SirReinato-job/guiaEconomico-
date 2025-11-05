import { createContext, useContext, useEffect, useState } from "react";
import { getGastos, adicionarGastoAPI } from "../services/gastosService";

const GastosContext = createContext();

export function GastosProvider({ children }) {
    const [gastos, setGastos] = useState([]);

    useEffect(() => {
        async function carregar() {
            const dados = await getGastos();
            setGastos(dados);
        }
        carregar();
    }, []);

    const adicionarGasto = async (novoGasto) => {
        const gastoSalvo = await adicionarGastoAPI(novoGasto);
        if (gastoSalvo) {
            setGastos((prev) => [...prev, gastoSalvo]);
        }
    };

    const FECHAMENTOS = {
        Nubank: { diaFechamento: 30 },
        Picpay: { diaFechamento: 30 },
        "Banco do Brasil": { diaFechamento: 27 },
    };

    function getIntervaloFatura(
        cartao,
        referencia = new Date(),
        ciclo = "atual"
    ) {
        const ano = referencia.getFullYear();
        const mes = referencia.getMonth();
        const fechamento = FECHAMENTOS[cartao]?.diaFechamento ?? 30;

        if (ciclo === "atual") {
            return {
                inicio: new Date(ano, mes - 1, fechamento + 1),
                fim: new Date(ano, mes, fechamento),
            };
        }

        if (ciclo === "anterior") {
            return {
                inicio: new Date(ano, mes - 2, fechamento + 1),
                fim: new Date(ano, mes - 1, fechamento),
            };
        }

        return { inicio: null, fim: null };
    }

    function getFaturaPorCartao(ciclo = "atual") {
        const totais = {};

        gastos.forEach((gasto) => {
            const cartao = gasto.cartao;
            const valor = parseFloat(gasto.valor);
            const dataGasto = new Date(gasto.data);
            const { inicio, fim } = getIntervaloFatura(
                cartao,
                new Date(),
                ciclo
            );

            if (dataGasto >= inicio && dataGasto <= fim) {
                if (!totais[cartao]) totais[cartao] = 0;
                totais[cartao] += valor;
            }
        });

        return totais;
    }

    function getFaturaTotalCartao(ciclo = "atual") {
        let total = 0;

        gastos.forEach((gasto) => {
            const valor = parseFloat(gasto.valor);
            const dataGasto = new Date(gasto.data);
            const { inicio, fim } = getIntervaloFatura(
                gasto.cartao,
                new Date(),
                ciclo
            );

            if (dataGasto >= inicio && dataGasto <= fim) {
                total += valor;
            }
        });

        return total;
    }

    function getGastosPorCategoria(tipo, ciclo = "atual") {
        let total = 0;

        gastos.forEach((gasto) => {
            if (gasto.tipo !== tipo) return;

            const dataGasto = new Date(gasto.data);
            const { inicio, fim } = getIntervaloFatura(
                gasto.cartao,
                new Date(),
                ciclo
            );

            if (dataGasto >= inicio && dataGasto <= fim) {
                total += parseFloat(gasto.valor);
            }
        });

        return total;
    }

    function getEssenciais() {
        return getGastosPorCategoria("Essencial");
    }

    function getLivres() {
        return getGastosPorCategoria("Desejo");
    }

    function getInvestimentos() {
        return getGastosPorCategoria("Poupança");
    }

    return (
        <GastosContext.Provider
            value={{
                gastos,
                adicionarGasto,
                getFaturaPorCartao,
                getFaturaTotalCartao,
                getEssenciais,
                getLivres,
                getInvestimentos,
            }}
        >
            {children}
        </GastosContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGastos() {
    return useContext(GastosContext);
}
