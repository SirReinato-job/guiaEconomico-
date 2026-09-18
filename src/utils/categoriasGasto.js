// src/utils/categoriasGasto.js

export const CATEGORIAS_PADRAO = [
    { id: "Supermercado", label: "🛒 Supermercado & Feira" },
    { id: "Alimentação", label: "🍽️ Alimentação & Restaurantes" },
    { id: "Lanches", label: "☕ Lanches & Delivery" },
    { id: "Transporte", label: "🚗 Transporte & Mobilidade" },
    { id: "Moradia", label: "🏠 Moradia & Contas Fixas" },
    { id: "Farmácia", label: "💊 Saúde & Farmácia" },
    { id: "Educação", label: "🎓 Educação & Cursos" },
    { id: "Vestuário", label: "👕 Roupas & Calçados" },
    { id: "Academia", label: "🏋️ Academia & Esportes" },
    { id: "Lazer", label: "🎮 Lazer & Entretenimento" },
    { id: "Assinaturas", label: "💻 Assinaturas & Serviços" },
    { id: "Pets", label: "🐾 Cuidados com Pets" },
    { id: "Manutenção", label: "🔧 Manutenção & Reformas" },
    { id: "Viagem", label: "✈️ Viagens & Passeios" },
    { id: "Presentes", label: "🎁 Presentes & Doações" },
    { id: "Poupança", label: "🏦 Poupança & Investimentos" },
    { id: "Caixinha", label: "📦 Caixinha Nubank" },
    { id: "OUTRO", label: "✏️ Outro (digitar categoria personalizada...)" },
];

/**
 * Normaliza uma categoria existente para identificar se é uma das categorias padrão
 * ou se é uma categoria personalizada digitada pelo usuário.
 *
 * @param {string} categoriaExistente
 * @returns {{ categoriaSelecionada: string, categoriaPersonalizada: string }}
 */
export function normalizarCategoria(categoriaExistente) {
    if (!categoriaExistente) {
        return {
            categoriaSelecionada: "Supermercado",
            categoriaPersonalizada: "",
        };
    }

    const valorLimpo = categoriaExistente.trim();

    // Procura correspondência com IDs das categorias padrão (exceto OUTRO)
    const matchPadrao = CATEGORIAS_PADRAO.find(
        (c) => c.id.toLowerCase() === valorLimpo.toLowerCase() && c.id !== "OUTRO"
    );

    if (matchPadrao) {
        return {
            categoriaSelecionada: matchPadrao.id,
            categoriaPersonalizada: "",
        };
    }

    // Se for uma categoria personalizada ou legado (ex: "Alura", "Uber", "Água", "Dentista", etc.)
    return {
        categoriaSelecionada: "OUTRO",
        categoriaPersonalizada: valorLimpo,
    };
}
