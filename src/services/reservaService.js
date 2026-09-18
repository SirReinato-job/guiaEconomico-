import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../config/firebase";

const STORAGE_KEY = "guia_reserva_config";
const DOC_PATH = ["configuracoes", "reserva"];

/**
 * Retorna as configurações e ajustes manuais da Reserva de Emergência.
 */
export async function getReservaConfig() {
    let localConfig = null;
    try {
        const salvo = localStorage.getItem(STORAGE_KEY);
        if (salvo) {
            localConfig = JSON.parse(salvo);
        }
    } catch (e) {
        console.warn("Erro ao ler configuração local da reserva:", e);
    }

    if (!isFirebaseConfigured) {
        return localConfig || {};
    }

    try {
        const docRef = doc(db, DOC_PATH[0], DOC_PATH[1]);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const configMesclada = { ...localConfig, ...data };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(configMesclada));
            return configMesclada;
        }
    } catch (error) {
        console.warn("Erro ao buscar configuração da reserva no Firestore:", error);
    }

    return localConfig || {};
}

/**
 * Salva os ajustes manuais da Reserva de Emergência no Firestore e no cache local.
 *
 * @param {Object} config
 * @param {number|null} config.saldoReal - Saldo real atual da Caixinha Nubank
 * @param {number|null} config.rendimentoManual - Rendimento real auferido no mês atual
 * @param {number|null} config.taxaManual - Taxa anual Selic informada manualmente (% a.a.)
 * @param {number|null} config.poupancaFixa - Valor fixo de aporte mensal futuro
 */
export async function salvarReservaConfig(config) {
    const payload = {
        ...config,
        atualizadoEm: new Date().toISOString(),
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn("Erro ao gravar configuração local da reserva:", e);
    }

    if (!isFirebaseConfigured) {
        return payload;
    }

    try {
        const docRef = doc(db, DOC_PATH[0], DOC_PATH[1]);
        await setDoc(docRef, payload, { merge: true });
        return payload;
    } catch (error) {
        console.error("Erro ao salvar configuração da reserva no Firestore:", error);
        return payload;
    }
}

/**
 * Registra o aporte (ou retirada) realizado no fechamento de um mês confirmado.
 * Se o saldo restante for positivo, é somado como aporte; se for negativo, é retirado da caixinha.
 *
 * @param {string} chaveMes - Identificador do mês (ex: "2026-09")
 * @param {number} valorSobra - Saldo restante no fechamento (receitas - gastos)
 */
export async function salvarAporteMesConfirmado(chaveMes, valorSobra) {
    const configAtual = await getReservaConfig();
    const aportesAtuais = configAtual.aportesConfirmados || {};

    const novosAportes = {
        ...aportesAtuais,
        [chaveMes]: {
            sobra: Number(valorSobra),
            dataConfirmacao: new Date().toISOString(),
        },
    };

    return await salvarReservaConfig({
        ...configAtual,
        aportesConfirmados: novosAportes,
    });
}
