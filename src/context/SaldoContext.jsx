// context/SaldoContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {
    getSaldo,
    adicionarReceitaAPI,
    atualizarReceitaAPI,
    removerReceitaAPI,
} from "../services/saldoService";
import { parseCurrency } from "../utils/currencyUtils";
import { useMes } from "./MesContext";

const SaldoContext = createContext();

export function SaldoProvider({ children }) {
    const [saldo, setSaldo] = useState([]);
    const { mesReferencia } = useMes() || {};
    const [salarioPadrao, setSalarioPadrao] = useState(); // valor recorrente padrão
    const [salariosPorMes, setSalariosPorMes] = useState({}); // ajustes por mês

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
        return receitaSalva;
    };

    const atualizarReceita = async (id, dadosAtualizados) => {
        const receitaAtualizada = await atualizarReceitaAPI(id, dadosAtualizados);
        if (receitaAtualizada) {
            setSaldo((prev) =>
                prev.map((item) => (item.id === id ? { ...item, ...receitaAtualizada } : item))
            );
        }
        return receitaAtualizada;
    };

    const removerReceita = async (id) => {
        const sucesso = await removerReceitaAPI(id);
        if (sucesso) {
            setSaldo((prev) => prev.filter((item) => item.id !== id));
        }
        return sucesso;
    };

    // Ajustar salário de um mês específico
    const ajustarSalarioMes = (ano, mes, valor) => {
        setSalariosPorMes((prev) => ({
            ...prev,
            [`${ano}-${mes}`]: valor,
        }));
    };

    // Obter salário do mês (ajustado ou padrão)
    const getSalarioDoMes = (ano, mes) => {
        return salariosPorMes[`${ano}-${mes}`] ?? salarioPadrao;
    };

    const getEntradasDoMes = (ref = mesReferencia) => {
        const dataRef = ref || new Date();
        const ano = dataRef.getFullYear();
        const mes = dataRef.getMonth();

        const salario = parseCurrency(getSalarioDoMes(ano, mes));

        const total = saldo
            .filter((item) => {
                const data = new Date(
                    item.data?.includes("T") ? item.data : `${item.data}T12:00:00`
                );
                return data.getMonth() === mes && data.getFullYear() === ano;
            })
            .reduce((acc, item) => acc + parseCurrency(item.valor), 0);

        return (total + salario).toFixed(2);
    };

    return (
        <SaldoContext.Provider
            value={{
                saldo,
                adicionarReceita,
                atualizarReceita,
                removerReceita,
                getEntradasDoMes,
                getSalarioDoMes,
                ajustarSalarioMes,
                salarioPadrao,
                setSalarioPadrao,
            }}
        >
            {children}
        </SaldoContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSaldo() {
    return useContext(SaldoContext);
}
