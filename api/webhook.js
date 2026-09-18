import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { parseNotification } from "../src/utils/notificationParser.js";

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

function getDbInstance() {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    return { app, db, auth };
}

export default async function handler(req, res) {
    // Permite CORS para requisições do celular ou testes
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-webhook-token");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Health check via GET
    if (req.method === "GET") {
        return res.status(200).json({
            status: "online",
            mensagem: "Webhook do Guia Econômico operacional.",
            timestamp: new Date().toISOString(),
        });
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido. Utilize POST." });
    }

    // 1. Validação do Token de Segurança
    const webhookSecret = process.env.WEBHOOK_SECRET || process.env.VITE_WEBHOOK_SECRET;
    const tokenRecebido =
        req.query.token ||
        req.headers["x-webhook-token"] ||
        req.body?.token ||
        req.body?.secret;

    if (webhookSecret && tokenRecebido !== webhookSecret) {
        console.warn("Tentativa de acesso com token inválido.");
        return res.status(401).json({ error: "Token de segurança inválido." });
    }

    // 2. Extração dos dados da notificação
    const body = req.body || {};
    const payload = {
        banco: body.banco || body.app || "",
        texto: body.texto || body.text || body.message || "",
        titulo: body.titulo || body.title || "",
    };

    const gastoFormatado = parseNotification(payload);

    if (!gastoFormatado) {
        return res.status(400).json({
            error: "Não foi possível extrair uma compra válida a partir do texto recebido.",
            payloadRecebido: payload,
        });
    }

    // 3. Gravação no Firebase Firestore
    try {
        const { db, auth } = getDbInstance();

        // Se houver credenciais dedicadas para automação no servidor, autentica
        const webhookEmail = process.env.WEBHOOK_AUTH_EMAIL;
        const webhookPassword = process.env.WEBHOOK_AUTH_PASSWORD;
        if (webhookEmail && webhookPassword && !auth.currentUser) {
            try {
                await signInWithEmailAndPassword(auth, webhookEmail, webhookPassword);
            } catch (authErr) {
                console.warn("Aviso na autenticação do webhook bot:", authErr.message);
            }
        }

        const docRef = await addDoc(collection(db, "gastos"), gastoFormatado);

        return res.status(200).json({
            success: true,
            mensagem: "Gasto registrado com sucesso no Guia Econômico!",
            gasto: {
                id: docRef.id,
                ...gastoFormatado,
            },
        });
    } catch (error) {
        console.error("Erro ao gravar gasto no Firestore via webhook:", error);
        return res.status(500).json({
            error: "Falha ao gravar no banco de dados.",
            detalhes: error.message,
        });
    }
}
