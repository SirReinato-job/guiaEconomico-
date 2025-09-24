export async function getGastos() {
  try {
    const response = await fetch('../../public/data/gastos.json');
    if (!response.ok) throw new Error('Erro ao buscar gastos');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}