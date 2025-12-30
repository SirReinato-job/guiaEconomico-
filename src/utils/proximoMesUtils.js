// utils/proximoMesUtils.js
export function getProximosMeses(qtd = 3) {
    const hoje = new Date();
    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    return Array.from({ length: qtd }).map((_, i) => {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() + i + 1, 1);
        return {
            mes: meses[data.getMonth()],
            ano: data.getFullYear(),
            mesIndex: data.getMonth(),
        };
    });
}
