import { createContext, useContext, useEffect, useState } from "react";
import {
    getGastos,
    adicionarGastoAPI,
    atualizarGastoAPI,
    removerGastoAPI,
} from "../services/gastosService";
import { parseCurrency } from "../utils/currencyUtils";
import { useMes } from "./MesContext";

const GastosContext = createContext();

export function GastosProvider({ children }) {
    const [gastos, setGastos] = useState([]);
    const { mesReferencia } = useMes() || {};

    useEffect(() => {
        async function carregar() {
            const dados = await getGastos();
            setGastos(dados);
        }
        carregar();
    }, []);

    // Calcula a data para cada mês seguinte de uma parcela
    function calcularDataParcela(dataBaseStr, mesesAFrente) {
        if (!dataBaseStr || mesesAFrente === 0) return dataBaseStr;

        const [anoStr, mesStr, diaStr] = dataBaseStr.split("-");
        const ano = parseInt(anoStr, 10);
        const mes = parseInt(mesStr, 10) - 1;
        const dia = parseInt(diaStr, 10);

        const totalMeses = mes + mesesAFrente;
        const novoAno = ano + Math.floor(totalMeses / 12);
        const novoMes = totalMeses % 12;

        const ultimoDiaDoMes = new Date(novoAno, novoMes + 1, 0).getDate();
        const diaFinal = Math.min(dia, ultimoDiaDoMes);

        const anoFormatado = novoAno;
        const mesFormatado = String(novoMes + 1).padStart(2, "0");
        const diaFormatado = String(diaFinal).padStart(2, "0");

        return `${anoFormatado}-${mesFormatado}-${diaFormatado}`;
    }

    const adicionarGasto = async (novoGasto) => {
        const numParcelas = parseInt(novoGasto.parcelas, 10) || 1;
        const valorTotal = parseCurrency(novoGasto.valor);
        const responsavel = novoGasto.responsavel || "meu";

        if (numParcelas <= 1) {
            const gastoSalvo = await adicionarGastoAPI({
                ...novoGasto,
                responsavel,
                valor: valorTotal > 0 ? valorTotal.toFixed(2).replace(".", ",") : novoGasto.valor,
            });
            if (gastoSalvo) setGastos((prev) => [...prev, gastoSalvo]);
            return;
        }

        // Divide o valor entre as parcelas
        const valorParcelaBase = Math.floor((valorTotal / numParcelas) * 100) / 100;
        const sobraCentavos = Number((valorTotal - valorParcelaBase * numParcelas).toFixed(2));
        const dataBase = novoGasto.data;

        const novosGastos = [];
        for (let i = 0; i < numParcelas; i++) {
            const valorParcela = i === 0 ? valorParcelaBase + sobraCentavos : valorParcelaBase;
            const dataParcela = calcularDataParcela(dataBase, i);

            novosGastos.push({
                ...novoGasto,
                data: dataParcela,
                valor: valorParcela.toFixed(2).replace(".", ","),
                parcela: `${i + 1}/${numParcelas}`,
            });
        }

        const promessas = novosGastos.map((gasto) => adicionarGastoAPI(gasto));
        const gastosSalvos = await Promise.all(promessas);
        const gastosValidos = gastosSalvos.filter(Boolean);

        if (gastosValidos.length > 0) {
            setGastos((prev) => [...prev, ...gastosValidos]);
        }
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
        referencia = mesReferencia || new Date(),
        ciclo = "atual"
    ) {
        const ref = referencia || mesReferencia || new Date();
        const ano = ref.getFullYear();
        const mes = ref.getMonth();
        const fechamento = FECHAMENTOS[cartao]?.diaFechamento ?? 30;

        if (ciclo === "atual") {
            return {
                inicio: new Date(ano, mes - 1, fechamento + 1, 0, 0, 0, 0),
                fim: new Date(ano, mes, fechamento, 23, 59, 59, 999),
            };
        }

        if (ciclo === "anterior") {
            return {
                inicio: new Date(ano, mes - 2, fechamento + 1, 0, 0, 0, 0),
                fim: new Date(ano, mes - 1, fechamento, 23, 59, 59, 999),
            };
        }

        if (ciclo === "proximo") {
            return {
                inicio: new Date(ano, mes, fechamento + 1, 0, 0, 0, 0),
                fim: new Date(ano, mes + 1, fechamento, 23, 59, 59, 999),
            };
        }

        return { inicio: null, fim: null };
    }

    const parseDataSegura = (dataStr) => {
        if (!dataStr) return null;
        return new Date(dataStr.includes("T") ? dataStr : `${dataStr}T12:00:00`);
    };

    // Gastos de um ciclo específico
    function getGastosDoCiclo(cartao, ciclo = "atual", ref = mesReferencia) {
        const { inicio, fim } = getIntervaloFatura(cartao, ref, ciclo);
        return gastos.filter((g) => {
            const data = parseDataSegura(g.data);
            return g.cartao === cartao && data && data >= inicio && data <= fim;
        });
    }

    // Fatura por cartão
    function getFaturaPorCartao(ciclo = "atual", ref = mesReferencia) {
        const totais = {};
        gastos.forEach((gasto) => {
            const cartao = gasto.cartao;
            const valor = parseCurrency(gasto.valor);
            const dataGasto = parseDataSegura(gasto.data);
            const { inicio, fim } = getIntervaloFatura(
                cartao,
                ref,
                ciclo
            );

            if (dataGasto && dataGasto >= inicio && dataGasto <= fim) {
                if (!totais[cartao]) totais[cartao] = 0;
                totais[cartao] += valor;
            }
        });
        return totais;
    }

    // Fatura total (todos os cartões)
    function getFaturaTotalCartao(ciclo = "atual", ref = mesReferencia) {
        let total = 0;
        gastos.forEach((gasto) => {
            const valor = parseCurrency(gasto.valor);
            const dataGasto = parseDataSegura(gasto.data);
            const { inicio, fim } = getIntervaloFatura(
                gasto.cartao,
                ref,
                ciclo
            );

            if (dataGasto && dataGasto >= inicio && dataGasto <= fim) {
                total += valor;
            }
        });
        return total;
    }

    // Gastos por categoria (Essencial, Desejo, Poupança)
    function getGastosPorCategoria(tipo, ciclo = "atual", ref = mesReferencia) {
        let total = 0;
        gastos.forEach((gasto) => {
            if (gasto.tipo !== tipo) return;
            const dataGasto = parseDataSegura(gasto.data);
            const { inicio, fim } = getIntervaloFatura(
                gasto.cartao,
                ref,
                ciclo
            );

            if (dataGasto && dataGasto >= inicio && dataGasto <= fim) {
                total += parseCurrency(gasto.valor);
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

    // Calcula os valores da Mozi por cartão e total geral (100% de mozi + 50% de dividido)
    function getGanhosMozi(ciclo = "atual", ref = mesReferencia) {
        const porCartao = {
            Nubank: 0,
            Picpay: 0,
            "Banco do Brasil": 0,
        };
        let totalGeral = 0;

        gastos.forEach((gasto) => {
            const responsavel = gasto.responsavel || "meu";
            if (responsavel === "meu") return;

            const cartao = gasto.cartao;
            const valorTotal = parseCurrency(gasto.valor);
            const dataGasto = parseDataSegura(gasto.data);
            const { inicio, fim } = getIntervaloFatura(
                cartao,
                ref,
                ciclo
            );

            if (dataGasto && dataGasto >= inicio && dataGasto <= fim) {
                const valorMozi = responsavel === "mozi" ? valorTotal : valorTotal * 0.5;

                if (!porCartao[cartao]) {
                    porCartao[cartao] = 0;
                }
                porCartao[cartao] += valorMozi;
                totalGeral += valorMozi;
            }
        });

        return {
            porCartao,
            totalGeral,
        };
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
                getGanhosMozi,
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
