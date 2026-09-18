import { DADOS_HISTORICOS_INICIAIS } from "./reservaHistoricoData.js";

export const NOMES_MESES = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
];

/**
 * Data de nascimento do usuário: 05/09/1997.
 * Calcula a idade com uma casa decimal (ex: 29.0, 29.1...).
 */
export function calcularIdade(dataStr) {
    const data = new Date(dataStr + "T12:00:00");
    const anos = data.getFullYear() - 1997;
    // Setembro é mês index 8
    const fracaoMeses = (data.getMonth() - 8) / 12;
    return Number((anos + fracaoMeses).toFixed(1));
}

/**
 * Calcula os anos decorridos desde o início da planilha em 01/09/2021.
 */
export function calcularAnoDecorrido(dataStr) {
    const data = new Date(dataStr + "T12:00:00");
    const anos = data.getFullYear() - 2021;
    const fracaoMeses = (data.getMonth() - 8 + 1) / 12;
    return Number(Math.max(0.1, anos + fracaoMeses).toFixed(1));
}

/**
 * Gera a série completa mensal da Reserva de Emergência desde 01/09/2021
 * até os 100 anos de idade do usuário (01/09/2097).
 *
 * @param {Object} params
 * @param {number} params.salarioMensal - Salário base mensal para cálculo dos 6 meses protegidos
 * @param {number} [params.saldoSobraMes] - Saldo que sobrou no mês atual (salário - gastos)
 * @param {number} [params.taxaSelicMensal] - Taxa Selic mensal em decimal (ex: 0.0093 para 0.93% a.m.)
 * @param {Object} [params.configManual] - Ajustes manuais de saldo real, rendimento ou taxa
 * @param {Date} [params.mesReferencia] - Mês selecionado no app (padrão: mês atual)
 */
export function gerarProjecaoReserva({
    salarioMensal = 3000,
    saldoSobraMes = null,
    taxaSelicMensal = 0.0093,
    configManual = {},
    mesReferencia = new Date(),
} = {}) {
    const salario = Number(salarioMensal) > 0 ? Number(salarioMensal) : 3000;
    const meta6Meses = salario * 6;

    const anoRef = mesReferencia ? mesReferencia.getFullYear() : new Date().getFullYear();
    const mesRefIndex = mesReferencia ? mesReferencia.getMonth() : new Date().getMonth();
    const chaveMesAtual = `${anoRef}-${String(mesRefIndex + 1).padStart(2, "0")}`;

    const taxaPadrao =
        configManual?.taxaManual !== undefined && configManual?.taxaManual !== null && configManual.taxaManual > 0
            ? Math.pow(1 + configManual.taxaManual / 100, 1 / 12) - 1
            : taxaSelicMensal || 0.0093;

    // Poupança fixa configurada ou média
    const poupancaPadraoFutura =
        configManual?.poupancaFixa !== undefined && configManual?.poupancaFixa !== null
            ? Number(configManual.poupancaFixa)
            : saldoSobraMes !== null && saldoSobraMes !== undefined && Number(saldoSobraMes) > 0
            ? Number(saldoSobraMes)
            : 1000.0;

    const linhas = [];

    // 1. Processar dados históricos conhecidos
    for (let i = 0; i < DADOS_HISTORICOS_INICIAIS.length; i++) {
        const item = { ...DADOS_HISTORICOS_INICIAIS[i] };
        const chaveItem = item.data.slice(0, 7);
        const ehMesAtual = chaveItem === chaveMesAtual;

        // Se for o mês atual e tiver ajuste manual de saldo real na caixinha
        if (ehMesAtual && configManual?.saldoReal !== undefined && configManual?.saldoReal !== null) {
            item.valorFinal = Number(configManual.saldoReal);
            if (configManual?.rendimentoManual !== undefined && configManual?.rendimentoManual !== null) {
                item.rendimento = Number(configManual.rendimentoManual);
            }
        }

        const mesesProtegidos = salario > 0 ? Number((item.valorFinal / salario).toFixed(2)) : 0;
        const statusMeta = classificarStatusMeta(item.valorFinal, meta6Meses);

        linhas.push({
            ...item,
            ehHistorico: true,
            ehMesAtual,
            mesesProtegidos,
            statusMeta,
        });
    }

    // 2. Projetar até o mês em que o usuário completa 100 anos: 01/09/2097
    const ultimaLinhaHistorica = linhas[linhas.length - 1];
    const ultimaData = new Date(ultimaLinhaHistorica.data + "T12:00:00");

    let anoCursor = ultimaData.getFullYear();
    let mesCursorIndex = ultimaData.getMonth() + 1; // Próximo mês

    if (mesCursorIndex > 11) {
        mesCursorIndex = 0;
        anoCursor++;
    }

    let valorAnterior = ultimaLinhaHistorica.valorFinal;

    while (anoCursor < 2097 || (anoCursor === 2097 && mesCursorIndex <= 8)) {
        const strMes = String(mesCursorIndex + 1).padStart(2, "0");
        const dataStr = `${anoCursor}-${strMes}-01`;
        const chaveItem = `${anoCursor}-${strMes}`;
        const ehMesAtual = chaveItem === chaveMesAtual;

        let valorInicial = valorAnterior;
        let poupanca = poupancaPadraoFutura;
        let taxa = taxaPadrao;

        // Se este mês tiver aporte confirmado previamente gravado
        const aporteConfirmado = configManual?.aportesConfirmados?.[chaveItem];
        if (aporteConfirmado && aporteConfirmado.sobra !== undefined && aporteConfirmado.sobra !== null) {
            poupanca = Number(aporteConfirmado.sobra);
        } else if (ehMesAtual) {
            // Se o mês atual estiver dentro do intervalo projetado e tiver sobra calculada
            if (saldoSobraMes !== null && saldoSobraMes !== undefined) {
                poupanca = Number(saldoSobraMes);
            }
        }

        let rendimento = Number(((valorInicial + poupanca) * taxa).toFixed(2));
        let valorFinal = Number((valorInicial + poupanca + rendimento).toFixed(2));

        if (ehMesAtual && configManual?.saldoReal !== undefined && configManual?.saldoReal !== null) {
            valorFinal = Number(configManual.saldoReal);
            if (configManual?.rendimentoManual !== undefined && configManual?.rendimentoManual !== null) {
                rendimento = Number(configManual.rendimentoManual);
            }
        }

        const idade = calcularIdade(dataStr);
        const anoDecorrido = calcularAnoDecorrido(dataStr);
        const mesesProtegidos = salario > 0 ? Number((valorFinal / salario).toFixed(2)) : 0;
        const statusMeta = classificarStatusMeta(valorFinal, meta6Meses);

        linhas.push({
            data: dataStr,
            mes: NOMES_MESES[mesCursorIndex],
            valorInicial,
            poupanca,
            taxa,
            valorFinal,
            rendimento,
            anoDecorrido,
            idade,
            ehHistorico: false,
            ehMesAtual,
            mesesProtegidos,
            statusMeta,
        });

        valorAnterior = valorFinal;

        mesCursorIndex++;
        if (mesCursorIndex > 11) {
            mesCursorIndex = 0;
            anoCursor++;
        }
    }

    // 3. Extrair métricas consolidadas e marcos
    const linhaAtual = linhas.find((l) => l.ehMesAtual) || linhas.find((l) => l.data.startsWith(chaveMesAtual)) || linhas[0];
    const estaProtegidoNoMesAtual = linhaAtual ? (linhaAtual.valorFinal >= meta6Meses) : false;

    // Se o mês atual estiver protegido, exibe onde foi atingido (passado).
    // Se NÃO estiver protegido, exibe a projeção futura de quando baterá a meta!
    let marco6Meses = null;
    if (estaProtegidoNoMesAtual) {
        const marcoPassado = linhas.find((l) => l.valorFinal >= meta6Meses);
        if (marcoPassado) {
            marco6Meses = {
                atingido: true,
                data: marcoPassado.data,
                mes: marcoPassado.mes,
                idade: marcoPassado.idade,
                valorFinal: marcoPassado.valorFinal,
            };
        }
    } else {
        const marcoFuturo = linhas.find((l) => l.data >= linhaAtual.data && l.valorFinal >= meta6Meses);
        if (marcoFuturo) {
            marco6Meses = {
                atingido: false,
                data: marcoFuturo.data,
                mes: marcoFuturo.mes,
                idade: marcoFuturo.idade,
                valorFinal: marcoFuturo.valorFinal,
            };
        }
    }

    const primeiroMesMilhao = linhas.find((l) => l.valorFinal >= 1000000);

    const marcos = {
        meta6Meses: marco6Meses,
        milhao1: primeiroMesMilhao ? {
            data: primeiroMesMilhao.data,
            mes: primeiroMesMilhao.mes,
            idade: primeiroMesMilhao.idade,
            valorFinal: primeiroMesMilhao.valorFinal,
        } : null,
        milhao2: encontrarPrimeiroAcimaDe(linhas, 2000000),
        milhao3: encontrarPrimeiroAcimaDe(linhas, 3000000),
        milhao5: encontrarPrimeiroAcimaDe(linhas, 5000000),
        milhao10: encontrarPrimeiroAcimaDe(linhas, 10000000),
    };

    const saldoAtual = linhaAtual?.valorFinal || 0;
    const rendimentoAtual = linhaAtual?.rendimento || 0;
    const mesesProtegidosAtual = salario > 0 ? Number((saldoAtual / salario).toFixed(2)) : 0;
    const porcentagemMeta6Meses = Math.min(100, Math.round((saldoAtual / meta6Meses) * 100));

    return {
        linhas,
        salario,
        meta6Meses,
        saldoAtual,
        rendimentoAtual,
        mesesProtegidosAtual,
        porcentagemMeta6Meses,
        linhaAtual,
        marcos,
        taxaSelicMensal: taxaPadrao,
    };
}

function encontrarPrimeiroAcimaDe(linhas, valor) {
    const item = linhas.find((l) => l.valorFinal >= valor);
    if (!item) return null;
    return {
        data: item.data,
        mes: item.mes,
        idade: item.idade,
        valorFinal: item.valorFinal,
    };
}

/**
 * Classifica a meta conforme o valor acumulado:
 * - 'abaixo': abaixo da reserva de 6 meses
 * - 'protegido': 6 meses ou mais, abaixo de R$ 1 milhão
 * - 'milhao': R$ 1.000.000 a R$ 1.999.999
 * - 'multimilhao': R$ 2.000.000 ou mais
 */
export function classificarStatusMeta(valorFinal, meta6Meses) {
    if (valorFinal >= 2000000) {
        const milhoes = Math.floor(valorFinal / 1000000);
        return {
            tipo: "multimilhao",
            label: `${milhoes}M 💎`,
            corTexto: "#38bdf8",
            corFundo: "rgba(56, 189, 248, 0.15)",
            corBorda: "#0284c7",
            milhoes,
        };
    }

    if (valorFinal >= 1000000) {
        return {
            tipo: "milhao",
            label: "1º Milhão 🏆",
            corTexto: "#c084fc",
            corFundo: "rgba(192, 132, 252, 0.18)",
            corBorda: "#9333ea",
            milhoes: 1,
        };
    }

    if (valorFinal >= meta6Meses) {
        return {
            tipo: "protegido",
            label: "Protegido 🛡️",
            corTexto: "#34d399",
            corFundo: "rgba(52, 211, 153, 0.15)",
            corBorda: "#10b981",
        };
    }

    return {
        tipo: "abaixo",
        label: "Em Construção 🏗️",
        corTexto: "#fbbf24",
        corFundo: "rgba(251, 191, 36, 0.12)",
        corBorda: "#d97706",
    };
}
