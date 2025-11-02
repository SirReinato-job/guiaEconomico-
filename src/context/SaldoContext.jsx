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

    const adicionarReceita = async (novoSaldo) => {
        const saldoSalvo = await adicionarReceitaAPI(novoSaldo);
        if (saldoSalvo) {
            setSaldo((prev) => [...prev, saldoSalvo]);
        }
    };
    const getSaldoDoMes = () => {
        const hoje = new Date();
        const total = saldo
            .filter((item) => {
                const data = new Date(item.data);
                return (
                    data.getMonth() === hoje.getMonth() &&
                    data.getFullYear() === hoje.getFullYear()
                );
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        return total.toFixed(2);
    };
    return (
        <SaldoContext.Provider
            value={{ saldo, adicionarReceita, getSaldoDoMes }}
        >
            {children}
        </SaldoContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSaldo() {
    return useContext(SaldoContext);
}
