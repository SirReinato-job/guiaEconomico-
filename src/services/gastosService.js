
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novoGasto)
    });

    if (!response.ok) throw new Error("Erro ao adicionar gasto");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}