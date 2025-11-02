import { createContext, useContext, useEffect, useState } from "react";
import { getSaldo, adicionarReceitaAPI } from "../services/saldoService";

const SaldoContext = createContext();

export function SaldoProvider({ children }) {
    const [saldo, setSaldo] = useState([]);

    useEffect(() => {
        async function carregar() {
            const dados = await getSaldo();
            setSaldo(dados);
        }
        carregar();
    }, []);

    const adicionarReceita = async (novaReceita) => {
        const receitaSalva = await adicionarReceitaAPI(novaReceita);
        if (receitaSalva) {
            setSaldo((prev) => [...prev, receitaSalva]);
        }
    };

    const getEntradasDoMes = () => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();

        const total = saldo
            .filter((item) => {
                const data = new Date(item.data);
                return data.getMonth() === mes && data.getFullYear() === ano;
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        return total.toFixed(2);
    };

    return (
        <SaldoContext.Provider
            value={{ saldo, adicionarReceita, getEntradasDoMes }}
        >
            {children}
        </SaldoContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSaldo() {
    return useContext(SaldoContext);
}
