import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
        "❌ Erro: As variáveis VITE_FIREBASE_* não foram encontradas no ambiente!"
    );
    console.error(
        "Certifique-se de preencher o arquivo .env.local com suas credenciais do Firebase antes de rodar o seed."
    );
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dbJsonPath = path.resolve(__dirname, "../db.json");
if (!fs.existsSync(dbJsonPath)) {
    console.error(`❌ db.json não encontrado em ${dbJsonPath}`);
    process.exit(1);
}

const dbData = JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));

async function seed() {
    console.log("🚀 Iniciando migração dos dados do db.json para o Firebase Firestore...\n");

    // 1. Saldo
    if (Array.isArray(dbData.saldo) && dbData.saldo.length > 0) {
        console.log(`📦 Importando ${dbData.saldo.length} registros de Saldo/Receita...`);
        for (const item of dbData.saldo) {
            const { id: _id, ...dados } = item;
            await addDoc(collection(db, "saldo"), dados);
        }
        console.log("✅ Saldo importado com sucesso.");
    }

    // 2. Essenciais
    if (Array.isArray(dbData.essenciais) && dbData.essenciais.length > 0) {
        console.log(`📦 Importando ${dbData.essenciais.length} registros de Gastos Essenciais...`);
        for (const item of dbData.essenciais) {
            const { id: _id, ...dados } = item;
            await addDoc(collection(db, "essenciais"), dados);
        }
        console.log("✅ Gastos Essenciais importados com sucesso.");
    }

    // 3. Gastos
    if (Array.isArray(dbData.gastos) && dbData.gastos.length > 0) {
        console.log(`📦 Importando ${dbData.gastos.length} registros de Gastos com Cartão...`);
        for (const item of dbData.gastos) {
            const { id: _id, ...dados } = item;
            await addDoc(collection(db, "gastos"), dados);
        }
        console.log("✅ Gastos com Cartão importados com sucesso.");
    }

    console.log("\n🎉 Migração concluída com sucesso no Firebase Firestore!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Erro durante a migração:", err);
    process.exit(1);
});
