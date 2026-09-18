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

const COLECAO = "gastos";

export async function getGastos() {
    if (!isFirebaseConfigured) {
        return [];
    }
    try {
        const querySnapshot = await getDocs(collection(db, COLECAO));
        const gastos = [];
        querySnapshot.forEach((docSnap) => {
            gastos.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });
        return gastos;
    } catch (error) {
        console.error("Erro ao buscar gastos no Firestore:", error);
        return [];
    }
}

export async function adicionarGastoAPI(novoGasto) {
    if (!isFirebaseConfigured) return null;
    try {
        const payload = {
            ...novoGasto,
            valor: parseCurrency(novoGasto.valor),
        };
        const docRef = await addDoc(collection(db, COLECAO), payload);
        return { id: docRef.id, ...payload };
    } catch (error) {
        console.error("Erro ao adicionar gasto no Firestore:", error);
        return null;
    }
}

export async function atualizarGastoAPI(id, dadosAtualizados) {
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
        console.error("Erro ao atualizar gasto no Firestore:", error);
        return null;
    }
}

export async function removerGastoAPI(id) {
    if (!isFirebaseConfigured) return false;
    try {
        const docRef = doc(db, COLECAO, id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Erro ao remover gasto no Firestore:", error);
        return false;
    }
}
