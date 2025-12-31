import { createContext, useContext, useEffect, useState } from "react";
import {
    getGastos,
    adicionarGastoAPI,
    atualizarGastoAPI,
    removerGastoAPI,
} from "../services/gastosService";

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

    // CRUD
    const adicionarGasto = async (novoGasto) => {
        const gastoSalvo = await adicionarGastoAPI(novoGasto);
        if (gastoSalvo) setGastos((prev) => [...prev, gastoSalvo]);
    };

    const atualizarGasto = async (id, dadosAtualizados) => {
        const atualizado = await atualizarGastoAPI(id, dadosAtualizados);
        if (atualizado) {
            setGastos((prev) =>
                prev.map((g) => (g.id === id ? atualizado : g))
            );
        }
    };

    const removerGasto = async (id) => {
        const removido = await removerGastoAPI(id);
        if (removido) {
            setGastos((prev) => prev.filter((g) => g.id !== id));
        }
    };

    // Configuração de fechamento de faturas
    const FECHAMENTOS = {
        Nubank: { diaFechamento: 30 },
        Picpay: { diaFechamento: 30 },
        "Banco do Brasil": { diaFechamento: 27 },
    };

    // Intervalo de fatura (atual, anterior, próximo)
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

        if (ciclo === "proximo") {
            return {
                inicio: new Date(ano, mes, fechamento + 1),
                fim: new Date(ano, mes + 1, fechamento),
            };
        }

        return { inicio: null, fim: null };
    }

    // Gastos de um ciclo específico
    function getGastosDoCiclo(cartao, ciclo = "atual") {
        const { inicio, fim } = getIntervaloFatura(cartao, new Date(), ciclo);
        return gastos.filter((g) => {
            const data = new Date(g.data);
            return g.cartao === cartao && data >= inicio && data <= fim;
        });
    }

    // Fatura por cartão
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

    // Fatura total (todos os cartões)
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

    // Gastos por categoria (Essencial, Desejo, Poupança)
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

    function getEssenciais(ciclo = "atual") {
        return getGastosPorCategoria("Essencial", ciclo);
    }

    function getLivres(ciclo = "atual") {
        return getGastosPorCategoria("Desejo", ciclo);
    }

    function getInvestimentos(ciclo = "atual") {
        return getGastosPorCategoria("Poupança", ciclo);
    }

    return (
        <GastosContext.Provider
            value={{
                gastos,
                adicionarGasto,
                atualizarGasto,
                removerGasto,
                getIntervaloFatura,
                getGastosDoCiclo,
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
