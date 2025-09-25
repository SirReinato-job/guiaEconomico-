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
      setGastos(prev => [...prev, gastoSalvo]);
    }
  };

  return (
    <GastosContext.Provider value={{ gastos, adicionarGasto }}>
      {children}
    </GastosContext.Provider>
  );
}

export function useGastos() {
  return useContext(GastosContext);
}