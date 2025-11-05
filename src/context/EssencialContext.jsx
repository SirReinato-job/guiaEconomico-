import { createContext, useContext, useEffect, useState } from "react";
import { adicionarEssencialAPI, getEssencial } from "../services/essencial";

const EssencialContext = createContext();

export function EssencialProvider({ children }) {
    const [essenciais, setEssenciais] = useState([]);

    useEffect(() => {
        async function carregar() {
            const dados = await getEssencial();
            setEssenciais(dados);
        }
        carregar();
    }, []);

    const adicionarEssencial = async (novoEssencial) => {
        const essencialSalvo = await adicionarEssencialAPI(novoEssencial);
        if (essencialSalvo) {
            setEssenciais((prev) => [...prev, essencialSalvo]);
        }
    };

    const getTotalEssenciais = () => {
        return essenciais.reduce(
            (acc, item) => acc + parseFloat(item.valor),
            0
        );
    };

    return (
        <EssencialContext.Provider
            value={{
                essenciais,
                adicionarEssencial,
                getTotalEssenciais,
            }}
        >
            {children}
        </EssencialContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEssencial() {
    return useContext(EssencialContext);
}
