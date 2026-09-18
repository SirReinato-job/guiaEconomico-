import { parseCurrency } from "./currencyUtils.js";

/**
 * Categorias automáticas baseadas em palavras-chave do estabelecimento.
 */
const REGRAS_CATEGORIAS = [
    {
        palavras: [
            "mercado",
            "supermercado",
            "hipermercado",
            "atacad",
            "carrefour",
            "extra",
            "pao de acucar",
            "assai",
            "hortifruti",
            "sacolao",
        ],
        categoria: "Supermercado",
        tipo: "Essencial",
    },
    {
        palavras: [
            "farmacia",
            "drogaria",
            "droga",
            "drogasil",
            "pacheco",
            "raia",
            "sao paulo",
            "ultrafarma",
        ],
        categoria: "Farmácia",
        tipo: "Essencial",
    },
    {
        palavras: [
            "uber",
            "99app",
            "99 pop",
            "gasolina",
            "posto",
            "combustivel",
            "ipiranga",
            "shell",
            "petrobras",
            "estapar",
            "pedagio",
        ],
        categoria: "Uber",
        tipo: "Desejo",
    },
    {
        palavras: [
            "padaria",
            "restaurante",
            "lanche",
            "mcdonald",
            "burger",
            "ifood",
            "subway",
            "pizzaria",
            "pizza",
            "bar",
            "cafe",
            "acai",
            "churrascaria",
            "sorveteria",
        ],
        categoria: "Alimentação",
        tipo: "Desejo",
    },
    {
        palavras: [
            "curso",
            "udemy",
            "escola",
            "faculdade",
            "livraria",
            "livro",
            "idiomas",
            "alura",
        ],
        categoria: "Educação",
        tipo: "Essencial",
    },
    {
        palavras: [
            "zara",
            "renner",
            "riachuelo",
            "c&a",
            "roupa",
            "calcado",
            "tenis",
            "nike",
            "adidas",
        ],
        categoria: "Roupas",
        tipo: "Desejo",
    },
];

/**
 * Deduz a categoria e o tipo do gasto com base no nome do estabelecimento.
 */
function deduzirCategoriaETipo(estabelecimento) {
    if (!estabelecimento) {
        return { categoria: "Outros", tipo: "Desejo" };
    }

    const texto = estabelecimento.toLowerCase();

    for (const regra of REGRAS_CATEGORIAS) {
        if (regra.palavras.some((p) => texto.includes(p))) {
            return { categoria: regra.categoria, tipo: regra.tipo };
        }
    }

    return { categoria: "Outros", tipo: "Desejo" };
}

/**
 * Normaliza o nome do cartão de crédito.
 */
function identificarCartao(bancoInformado, textoCompleto) {
    const texto = `${bancoInformado || ""} ${textoCompleto || ""}`.toLowerCase();

    if (texto.includes("nubank") || texto.includes("roxinho")) {
        return "Nubank";
    }
    if (
        texto.includes("banco do brasil") ||
        texto.includes("bb") ||
        texto.includes("ourocard")
    ) {
        return "Banco do Brasil";
    }
    if (texto.includes("picpay")) {
        return "Picpay";
    }

    return bancoInformado || "Nubank";
}

/**
 * Extrai valor monetário numérico do texto da notificação.
 */
function extrairValor(texto) {
    // Ex: "R$ 45,90" ou "R$45.90" ou "R$ 1.250,00" ou "R$ 15"
    const regex = /R\$\s*([\d.]+,\d{2}|\d+,\d{2}|\d+\.\d{2}|\d+)/i;
    const match = texto.match(regex);
    if (match && match[1]) {
        return parseCurrency(match[1]);
    }
    return null;
}

/**
 * Extrai o nome da loja/estabelecimento do texto da notificação.
 */
function extrairEstabelecimento(texto) {
    // Remove menções de meio de pagamento que possam anteceder a loja
    const textoLimpo = texto
        .replace(/no cartão de crédito/gi, "")
        .replace(/no cartão/gi, "")
        .replace(/no crédito/gi, "")
        .replace(/com ourocard.*?final\s+\d+/gi, "")
        .replace(/com cartão.*?final\s+\d+/gi, "")
        .replace(/cartão final\s+\d+/gi, "");

    // Padrão 1: "em [Nome da Loja] no valor de" ou "em [Nome da Loja] aprovada"
    const padrao1 = /(?:em|no|na)\s+([^.,]+?)(?:\s+no valor|\s+aprovada|\s+no cartao|\s+no crédito|\.|$)/i;
    const match1 = textoLimpo.match(padrao1);
    if (match1 && match1[1] && match1[1].trim().length > 1) {
        return match1[1].trim();
    }

    // Padrão 2: "Compra aprovada em [Nome da Loja]"
    const padrao2 = /aprovada\s+(?:em|no|na)\s+([^.,]+?)(?:\s+no valor|\.|$)/i;
    const match2 = textoLimpo.match(padrao2);
    if (match2 && match2[1] && match2[1].trim().length > 1) {
        return match2[1].trim();
    }

    return "Compra com cartão";
}

/**
 * Função principal para processar o payload da notificação recebida do MacroDroid.
 *
 * @param {Object} payload
 * @param {string} payload.banco - Nome do banco ou app
 * @param {string} payload.texto - Texto completo da notificação
 * @param {string} [payload.titulo] - Título da notificação (opcional)
 * @returns {Object|null} Objeto pronto para salvar na coleção "gastos", ou null se inválido
 */
export function parseNotification(payload = {}) {
    const texto = `${payload.titulo || ""} ${payload.texto || ""}`.trim();
    if (!texto) {
        return null;
    }

    const valor = extrairValor(texto);
    if (!valor || valor <= 0) {
        return null; // Não é uma notificação com valor de compra
    }

    const cartao = identificarCartao(payload.banco, texto);
    const estabelecimento = extrairEstabelecimento(texto);
    const { categoria, tipo } = deduzirCategoriaETipo(estabelecimento);

    // Data atual no formato YYYY-MM-DD
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    return {
        data: dataFormatada,
        valor: valor,
        cartao: cartao,
        categoria: categoria,
        tipo: tipo,
        responsavel: "meu",
        descricao: estabelecimento,
        origem: "webhook_notificacao",
        criadoEm: new Date().toISOString(),
    };
}
