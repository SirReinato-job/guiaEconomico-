import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../config/firebase";
import { parseCurrency } from "../utils/formatters";

const COLECAO = "essenciais";

export async function getEssencial() {
    if (!isFirebaseConfigured) {
        return [];
    }
    try {
        const querySnapshot = await getDocs(collection(db, COLECAO));
        const essenciais = [];
        querySnapshot.forEach((docSnap) => {
            essenciais.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });
        return essenciais;
    } catch (error) {
        console.error("Erro ao buscar gastos essenciais no Firestore:", error);
        return [];
    }
}

export async function adicionarEssencialAPI(novoEssencial) {
    if (!isFirebaseConfigured) return null;
    try {
        const payload = {
            ...novoEssencial,
            valor: parseCurrency(novoEssencial.valor),
        };
        const docRef = await addDoc(collection(db, COLECAO), payload);
        return { id: docRef.id, ...payload };
    } catch (error) {
        console.error("Erro ao adicionar gasto essencial no Firestore:", error);
        return null;
    }
}

export async function atualizarEssencialAPI(id, dadosAtualizados) {
    if (!isFirebaseConfigured) return null;
    try {
        const { id: _id, ...dados } = dadosAtualizados;
        if (dados.valor !== undefined) {
            dados.valor = parseCurrency(dados.valor);
        }
        const docRef = doc(db, COLECAO, id);
        await updateDoc(docRef, dados);
        return { id, ...dados };
    } catch (error) {
        console.error("Erro ao atualizar gasto essencial no Firestore:", error);
        return null;
    }
}

export async function removerEssencialAPI(id) {
    if (!isFirebaseConfigured) return false;
    try {
        const docRef = doc(db, COLECAO, id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Erro ao remover gasto essencial no Firestore:", error);
        return false;
    }
}
