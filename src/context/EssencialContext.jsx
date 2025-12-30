import { createContext, useContext, useEffect, useState } from "react";
import {
    adicionarEssencialAPI,
    getEssencial,
    atualizarEssencialAPI,
} from "../services/essencial";

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

    // NOVO: atualizar essencial existente
    const atualizarEssencial = async (id, dadosAtualizados) => {
        const atualizado = await atualizarEssencialAPI(id, dadosAtualizados);
        if (atualizado) {
            setEssenciais((prev) =>
                prev.map((item) => (item.id === id ? atualizado : item))
            );
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
                atualizarEssencial, // expõe para a modal
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
