const BASE_URL = "http://localhost:3000/saldo";

export async function getSaldo() {
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

export async function adicionarReceitaAPI(novoSaldo) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoSaldo),
        });

        if (!response.ok) throw new Error("Erro ao adicionar saldo");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
