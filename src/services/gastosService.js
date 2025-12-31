const BASE_URL = "http://localhost:3000/gastos";

export async function getGastos() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Erro ao buscar gastos");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function adicionarGastoAPI(novoGasto) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoGasto),
        });
        if (!response.ok) throw new Error("Erro ao adicionar gasto");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function atualizarGastoAPI(id, dadosAtualizados) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados),
        });
        if (!response.ok) throw new Error("Erro ao atualizar gasto");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function removerGastoAPI(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao remover gasto");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
