export async function getSaldoPorDia() {
  try {
    const response = await fetch('../../public/data/saldo.json');
    if (!response.ok) throw new Error('Erro ao buscar saldo');
    return await response.json();
  } catch (error) {
    console.error(error);
    return { labels: [], saldoPorDia: [] };
  }
}