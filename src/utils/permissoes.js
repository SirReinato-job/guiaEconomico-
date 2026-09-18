/**
 * E-mails padrão do proprietário do Guia Econômico com acesso total aos Insights Financeiros.
 */
export const EMAILS_PROPRIETARIOS_PADRAO = [
    "renatofranca2881@gmail.com",
];

/**
 * Verifica se um determinado e-mail possui permissão para visualizar
 * e editar os Insights Financeiros e a Reserva de Emergência.
 *
 * @param {string|null|undefined} userEmail
 * @returns {boolean}
 */
export function isProprietarioInsights(userEmail) {
    if (!userEmail || typeof userEmail !== "string") return false;
    const emailNormalizado = userEmail.trim().toLowerCase();

    // Lê variáveis de ambiente com segurança (Vite ou Node)
    const env = (typeof import.meta !== "undefined" && import.meta?.env) || {};

    const envEmails = [
        env.VITE_OWNER_EMAIL,
        env.VITE_INSIGHTS_ALLOWED_EMAILS,
        env.VITE_ALLOWED_EMAIL,
    ]
        .filter(Boolean)
        .flatMap((item) =>
            item.split(",").map((e) => e.trim().toLowerCase())
        );

    const autorizados = new Set([
        ...EMAILS_PROPRIETARIOS_PADRAO,
        ...envEmails,
    ]);

    return autorizados.has(emailNormalizado);
}
