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


  const FECHAMENTOS = {
    "Nubank": { diaFechamento: 30 },
    "Picpay": { diaFechamento: 2 },
    "Banco do Brasil": { diaFechamento: 27 }
  };

  const getTotalPorCartao = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const totais = {};

    gastos.forEach(gasto => {
      const dataGasto = new Date(gasto.data);
      const cartao = gasto.cartao;
      const valor = parseFloat(gasto.valor);
      const fechamento = FECHAMENTOS[cartao]?.diaFechamento ?? 30;

      const inicioFatura = new Date(ano, mes - 1, fechamento + 1);
      const fimFatura = new Date(ano, mes, fechamento);

      if (dataGasto >= inicioFatura && dataGasto <= fimFatura) {
        if (!totais[cartao]) totais[cartao] = 0;
        totais[cartao] += valor;
      }
    });

    return totais;
  };


  return (
    <GastosContext.Provider value={{ gastos, adicionarGasto, getTotalPorCartao }}>
      {children}
    </GastosContext.Provider>
  );
}

export function useGastos() {
  return useContext(GastosContext);
}