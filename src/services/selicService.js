/**
 * Serviço para consulta da Taxa Selic oficial via API do Banco Central do Brasil (BCB).
 */

const CACHE_KEY = "guia_selic_cache";

/**
 * Converte taxa anual em percentual (ex: 11.15) para taxa mensal decimal (ex: 0.0093).
 */
export function converterAnualParaMensal(taxaAnualPercentual) {
    const anualDecimal = taxaAnualPercentual / 100;
    // Fórmula de juros compostos mensal equivalente
    return Math.pow(1 + anualDecimal, 1 / 12) - 1;
}

/**
 * Consulta a taxa Selic Meta atualizada.
 * Utiliza cache local mensal para evitar chamadas excessivas.
 */
export async function getTaxaSelicAtual(forcarAtualizacao = false) {
    const hoje = new Date();
    const chaveMesAtual = `${hoje.getFullYear()}-${hoje.getMonth() + 1}`;

    if (!forcarAtualizacao) {
        try {
            const cache = localStorage.getItem(CACHE_KEY);
            if (cache) {
                const dadosCache = JSON.parse(cache);
                if (dadosCache.mesReferencia === chaveMesAtual && dadosCache.taxaAnual) {
                    return dadosCache;
                }
            }
        } catch (e) {
            console.warn("Erro ao ler cache da Selic:", e);
        }
    }

    try {
        // Consulta API oficial do Banco Central do Brasil (SGS - Série 432: Selic Meta)
        const response = await fetch(
            "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json",
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error(`Erro na API do BCB: status ${response.status}`);
        }

        const dados = await response.json();
        if (Array.isArray(dados) && dados.length > 0) {
            const taxaAnual = parseFloat(dados[0].valor);
            const taxaMensal = converterAnualParaMensal(taxaAnual);

            const resultado = {
                taxaAnual: taxaAnual,
                taxaMensal: Number(taxaMensal.toFixed(6)),
                dataConsulta: dados[0].data,
                mesReferencia: chaveMesAtual,
            };

            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(resultado));
            } catch (e) {
                console.warn("Não foi possível salvar cache da Selic:", e);
            }

            return resultado;
        }
    } catch (erro) {
        console.warn("Falha ao consultar API do BCB, tentando BrasilAPI...", erro);
    }

    // Fallback: BrasilAPI
    try {
        const response = await fetch("https://brasilapi.com.br/api/taxas/v1/selic");
        if (response.ok) {
            const dados = await response.json();
            const taxaAnual = parseFloat(dados.valor);
            const taxaMensal = converterAnualParaMensal(taxaAnual);

            const resultado = {
                taxaAnual: taxaAnual,
                taxaMensal: Number(taxaMensal.toFixed(6)),
                dataConsulta: new Date().toLocaleDateString("pt-BR"),
                mesReferencia: chaveMesAtual,
            };

            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(resultado));
            } catch (e) {
                console.warn("Não foi possível salvar cache:", e);
            }

            return resultado;
        }
    } catch (fallbackErr) {
        console.warn("Fallback BrasilAPI também falhou:", fallbackErr);
    }

    // Padrão seguro da planilha (11.15% a.a. / 0.93% a.m.)
    return {
        taxaAnual: 11.15,
        taxaMensal: 0.0093,
        dataConsulta: new Date().toLocaleDateString("pt-BR"),
        mesReferencia: chaveMesAtual,
    };
}
