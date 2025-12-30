// context/SaldoContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { getSaldo, adicionarReceitaAPI } from "../services/saldoService";

const SaldoContext = createContext();

export function SaldoProvider({ children }) {
    const [saldo, setSaldo] = useState([]);
    const [salarioPadrao, setSalarioPadrao] = useState(1629); // valor recorrente padrão
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

    const getEntradasDoMes = () => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();

        const salario = getSalarioDoMes(ano, mes);

        const total = saldo
            .filter((item) => {
                const data = new Date(item.data);
                return data.getMonth() === mes && data.getFullYear() === ano;
            })
            .reduce((acc, item) => acc + parseFloat(item.valor), 0);

        return (total + salario).toFixed(2);
    };

    return (
        <SaldoContext.Provider
            value={{
                saldo,
                adicionarReceita,
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
