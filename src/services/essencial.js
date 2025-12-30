const BASE_URL = "http://localhost:3000/essenciais";

export async function getEssencial() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Erro ao buscar gastos essenciais");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function adicionarEssencialAPI(novoEssencial) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoEssencial),
        });
        if (!response.ok) throw new Error("Erro ao adicionar gasto essencial");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function atualizarEssencialAPI(id, dadosAtualizados) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosAtualizados),
        });
        if (!response.ok) throw new Error("Erro ao atualizar gasto essencial");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
