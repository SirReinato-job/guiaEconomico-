/**
 * Converte valores em formato numérico ou monetário (string brasileira ou internacional, com ou sem R$) para float numérico.
 *
 * Exemplos:
 *   parseCurrency(100)           => 100
 *   parseCurrency("100")         => 100
 *   parseCurrency("54,83")       => 54.83
 *   parseCurrency("49.99")       => 49.99
 *   parseCurrency("R$ 1.250,50") => 1250.5
 *   parseCurrency("R$ 1,250.50") => 1250.5
 *   parseCurrency("-R$ 50,00")   => -50
 *   parseCurrency(null)          => 0
 *   parseCurrency(undefined)     => 0
 */
export function parseCurrency(value) {
    if (value === null || value === undefined) {
        return 0;
    }

    if (typeof value === "number") {
        return isNaN(value) ? 0 : value;
    }

    if (typeof value !== "string") {
        return 0;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return 0;
    }

    const isNegative = trimmed.includes("-");
    // Remove caracteres não numéricos exceto ponto e vírgula
    let clean = trimmed.replace(/[^\d.,]/g, "");
    if (!clean) {
        return 0;
    }

    if (clean.includes(".") && clean.includes(",")) {
        if (clean.indexOf(".") < clean.indexOf(",")) {
            // Padrão pt-BR: 1.234,56 -> 1234.56
            clean = clean.replace(/\./g, "").replace(",", ".");
        } else {
            // Padrão en-US: 1,234.56 -> 1234.56
            clean = clean.replace(/,/g, "");
        }
    } else if (clean.includes(",")) {
        // Apenas vírgula: 54,83 -> 54.83
        clean = clean.replace(",", ".");
    }

    const parsed = parseFloat(clean);
    if (isNaN(parsed)) {
        return 0;
    }

    return isNegative ? -parsed : parsed;
}

/**
 * Formata um número ou valor monetário para formato de moeda brasileira (BRL).
 * Exemplo: 1250.5 => "R$ 1.250,50"
 */
export function formatCurrency(value) {
    const num = parseCurrency(value);
    return num.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export default parseCurrency;
