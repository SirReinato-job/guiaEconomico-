/**
 * Dados históricos reais da planilha Reserva de Emergência
 * Período inicial: 01/09/2021 até 2026
 */
export const DADOS_HISTORICOS_INICIAIS = [
    // 2021
    { data: "2021-09-01", mes: "setembro", valorInicial: 1897.37, poupanca: 251.60, taxa: 0.0043, valorFinal: 2150.05, rendimento: 1.08, anoDecorrido: 0.1, idade: 24.0 },
    { data: "2021-10-01", mes: "outubro", valorInicial: 2414.05, poupanca: 264.00, taxa: 0.0043, valorFinal: 2424.43, rendimento: 10.38, anoDecorrido: 0.2, idade: 24.1 },
    { data: "2021-11-01", mes: "novembro", valorInicial: 2789.43, poupanca: 365.00, taxa: 0.0043, valorFinal: 2801.42, rendimento: 11.99, anoDecorrido: 0.3, idade: 24.2 },
    { data: "2021-12-01", mes: "dezembro", valorInicial: 3501.42, poupanca: 700.00, taxa: 0.0043, valorFinal: 3516.48, rendimento: 15.06, anoDecorrido: 0.3, idade: 24.3 },

    // 2022
    { data: "2022-01-01", mes: "janeiro", valorInicial: 3849.48, poupanca: 333.00, taxa: 0.0093, valorFinal: 3893.59, rendimento: 44.11, anoDecorrido: 0.4, idade: 24.4 },
    { data: "2022-02-01", mes: "fevereiro", valorInicial: 4226.59, poupanca: 333.00, taxa: 0.0093, valorFinal: 4275.02, rendimento: 48.43, anoDecorrido: 0.5, idade: 24.5 },
    { data: "2022-03-01", mes: "março", valorInicial: 4608.02, poupanca: 333.00, taxa: 0.0093, valorFinal: 4645.96, rendimento: 37.94, anoDecorrido: 0.6, idade: 24.6 },
    { data: "2022-04-01", mes: "abril", valorInicial: 4978.96, poupanca: 333.00, taxa: 0.0093, valorFinal: 5014.44, rendimento: 35.48, anoDecorrido: 0.7, idade: 24.7 },
    { data: "2022-05-01", mes: "maio", valorInicial: 5347.44, poupanca: 333.00, taxa: 0.0093, valorFinal: 5392.64, rendimento: 45.20, anoDecorrido: 0.8, idade: 24.8 },
    { data: "2022-06-01", mes: "junho", valorInicial: 5725.64, poupanca: 333.00, taxa: 0.0093, valorFinal: 5775.94, rendimento: 50.30, anoDecorrido: 0.8, idade: 24.8 },
    { data: "2022-07-01", mes: "julho", valorInicial: 6675.94, poupanca: 900.00, taxa: 0.0093, valorFinal: 6739.05, rendimento: 63.11, anoDecorrido: 0.9, idade: 24.9 },
    { data: "2022-08-01", mes: "agosto", valorInicial: 7172.38, poupanca: 433.33, taxa: 0.0100, valorFinal: 7245.91, rendimento: 73.53, anoDecorrido: 1.0, idade: 25.0 },
    { data: "2022-09-01", mes: "setembro", valorInicial: 7678.91, poupanca: 433.00, taxa: 0.0093, valorFinal: 7753.49, rendimento: 74.58, anoDecorrido: 1.1, idade: 25.0 },
    { data: "2022-10-01", mes: "outubro", valorInicial: 8153.49, poupanca: 400.00, taxa: 0.0093, valorFinal: 8239.29, rendimento: 85.80, anoDecorrido: 1.2, idade: 25.1 },
    { data: "2022-11-01", mes: "novembro", valorInicial: 8639.29, poupanca: 400.00, taxa: 0.0093, valorFinal: 8714.38, rendimento: 75.09, anoDecorrido: 1.3, idade: 25.2 },
    { data: "2022-12-01", mes: "dezembro", valorInicial: 9714.38, poupanca: 1000.00, taxa: 0.0093, valorFinal: 9806.52, rendimento: 92.14, anoDecorrido: 1.3, idade: 25.3 },

    // 2023
    { data: "2023-01-01", mes: "janeiro", valorInicial: 10206.52, poupanca: 400.00, taxa: 0.0093, valorFinal: 10303.78, rendimento: 97.26, anoDecorrido: 1.4, idade: 25.4 },
    { data: "2023-02-01", mes: "fevereiro", valorInicial: 10303.78, poupanca: 0.00, taxa: 0.0093, valorFinal: 10384.91, rendimento: 81.13, anoDecorrido: 1.5, idade: 25.5 },
    { data: "2023-03-01", mes: "março", valorInicial: 10384.91, poupanca: 0.00, taxa: 0.0093, valorFinal: 10502.56, rendimento: 117.65, anoDecorrido: 1.6, idade: 25.6 },
    { data: "2023-04-01", mes: "abril", valorInicial: 10502.56, poupanca: 0.00, taxa: 0.0093, valorFinal: 10586.61, rendimento: 84.05, anoDecorrido: 1.7, idade: 25.7 },
    { data: "2023-05-01", mes: "maio", valorInicial: 10586.61, poupanca: 0.00, taxa: 0.0093, valorFinal: 10690.91, rendimento: 104.30, anoDecorrido: 1.8, idade: 25.8 },
    { data: "2023-06-01", mes: "junho", valorInicial: 10690.91, poupanca: 0.00, taxa: 0.0093, valorFinal: 10792.33, rendimento: 101.42, anoDecorrido: 1.8, idade: 25.8 },
    { data: "2023-07-01", mes: "julho", valorInicial: 10792.33, poupanca: 0.00, taxa: 0.0093, valorFinal: 10895.00, rendimento: 102.67, anoDecorrido: 1.9, idade: 25.9 },
    { data: "2023-08-01", mes: "agosto", valorInicial: 10895.00, poupanca: 0.00, taxa: 0.0093, valorFinal: 11002.95, rendimento: 107.95, anoDecorrido: 2.0, idade: 26.0 },
    { data: "2023-09-01", mes: "setembro", valorInicial: 11002.95, poupanca: 0.00, taxa: 0.0093, valorFinal: 11028.72, rendimento: 25.77, anoDecorrido: 2.1, idade: 26.0 },
    { data: "2023-10-01", mes: "outubro", valorInicial: 11028.72, poupanca: 0.00, taxa: 0.0093, valorFinal: 11150.93, rendimento: 122.21, anoDecorrido: 2.2, idade: 26.1 },
    { data: "2023-11-01", mes: "novembro", valorInicial: 11150.93, poupanca: 0.00, taxa: 0.0093, valorFinal: 11243.43, rendimento: 92.50, anoDecorrido: 2.3, idade: 26.2 },
    { data: "2023-12-01", mes: "dezembro", valorInicial: 11243.43, poupanca: 0.00, taxa: 0.0093, valorFinal: 11335.93, rendimento: 92.50, anoDecorrido: 2.3, idade: 26.3 },

    // 2024
    { data: "2024-01-01", mes: "janeiro", valorInicial: 11335.93, poupanca: 0.00, taxa: 0.0093, valorFinal: 11425.93, rendimento: 90.00, anoDecorrido: 2.4, idade: 26.4 },
    { data: "2024-02-01", mes: "fevereiro", valorInicial: 11425.93, poupanca: 0.00, taxa: 0.0093, valorFinal: 11446.05, rendimento: 90.00, anoDecorrido: 2.5, idade: 26.5 },
    { data: "2024-03-01", mes: "março", valorInicial: 11446.05, poupanca: 0.00, taxa: 0.0093, valorFinal: 11442.57, rendimento: 81.70, anoDecorrido: 2.6, idade: 26.5 },
    { data: "2024-04-01", mes: "abril", valorInicial: 25315.74, poupanca: 13873.17, taxa: 0.0093, valorFinal: 25434.61, rendimento: 118.87, anoDecorrido: 2.7, idade: 26.6 },
    { data: "2024-05-01", mes: "maio", valorInicial: 22687.73, poupanca: -2746.88, taxa: 0.0093, valorFinal: 22875.04, rendimento: 187.31, anoDecorrido: 2.8, idade: 26.7 },
    { data: "2024-06-01", mes: "junho", valorInicial: 21167.55, poupanca: -1707.49, taxa: 0.0093, valorFinal: 21315.49, rendimento: 147.94, anoDecorrido: 2.8, idade: 26.8 },
    { data: "2024-07-01", mes: "julho", valorInicial: 19805.74, poupanca: -1509.75, taxa: 0.0093, valorFinal: 19915.74, rendimento: 110.00, anoDecorrido: 2.9, idade: 26.8 },
    { data: "2024-08-01", mes: "agosto", valorInicial: 17995.65, poupanca: -1920.09, taxa: 0.0093, valorFinal: 18105.05, rendimento: 109.40, anoDecorrido: 3.0, idade: 26.9 },
    { data: "2024-09-01", mes: "setembro", valorInicial: 16230.28, poupanca: -1874.77, taxa: 0.0093, valorFinal: 16330.28, rendimento: 100.00, anoDecorrido: 3.1, idade: 27.0 },
    { data: "2024-10-01", mes: "outubro", valorInicial: 14275.15, poupanca: -2055.13, taxa: 0.0093, valorFinal: 14375.15, rendimento: 100.00, anoDecorrido: 3.2, idade: 27.1 },
    { data: "2024-11-01", mes: "novembro", valorInicial: 13173.35, poupanca: -1201.80, taxa: 0.0093, valorFinal: 13271.35, rendimento: 98.00, anoDecorrido: 3.3, idade: 27.2 },
    { data: "2024-12-01", mes: "dezembro", valorInicial: 12409.05, poupanca: -862.30, taxa: 0.0093, valorFinal: 12505.05, rendimento: 96.00, anoDecorrido: 3.3, idade: 27.3 },

    // 2025
    { data: "2025-01-01", mes: "janeiro", valorInicial: 11996.31, poupanca: -508.74, taxa: 0.0093, valorFinal: 12091.31, rendimento: 95.00, anoDecorrido: 3.4, idade: 27.3 },
    { data: "2025-02-01", mes: "fevereiro", valorInicial: 11208.70, poupanca: -882.61, taxa: 0.0093, valorFinal: 11293.70, rendimento: 85.00, anoDecorrido: 3.5, idade: 27.4 },
    { data: "2025-03-01", mes: "março", valorInicial: 10511.25, poupanca: -782.45, taxa: 0.0093, valorFinal: 10608.92, rendimento: 80.00, anoDecorrido: 3.6, idade: 27.5 },
    { data: "2025-04-01", mes: "abril", valorInicial: 9430.29, poupanca: -1178.63, taxa: 0.0093, valorFinal: 9517.91, rendimento: 87.62, anoDecorrido: 3.7, idade: 27.6 },
    { data: "2025-05-01", mes: "maio", valorInicial: 8278.46, poupanca: -1239.45, taxa: 0.0093, valorFinal: 8355.38, rendimento: 76.92, anoDecorrido: 3.8, idade: 27.7 },
    { data: "2025-06-01", mes: "junho", valorInicial: 7588.53, poupanca: -766.85, taxa: 0.0093, valorFinal: 7659.04, rendimento: 70.51, anoDecorrido: 3.8, idade: 27.8 },
    { data: "2025-07-01", mes: "julho", valorInicial: 7782.23, poupanca: 123.19, taxa: 0.0093, valorFinal: 7854.54, rendimento: 72.31, anoDecorrido: 3.9, idade: 27.8 },
    { data: "2025-08-01", mes: "agosto", valorInicial: 6181.83, poupanca: -1672.71, taxa: 0.0093, valorFinal: 6239.27, rendimento: 57.44, anoDecorrido: 4.0, idade: 27.9 },
    { data: "2025-09-01", mes: "setembro", valorInicial: 5435.06, poupanca: -804.20, taxa: 0.0093, valorFinal: 5485.57, rendimento: 50.50, anoDecorrido: 4.1, idade: 28.0 },
    { data: "2025-10-01", mes: "outubro", valorInicial: 6415.94, poupanca: 930.37, taxa: 0.0093, valorFinal: 6475.55, rendimento: 59.61, anoDecorrido: 4.2, idade: 28.1 },
    { data: "2025-11-01", mes: "novembro", valorInicial: 5354.16, poupanca: -1121.40, taxa: 0.0093, valorFinal: 5403.90, rendimento: 49.75, anoDecorrido: 4.3, idade: 28.2 },
    { data: "2025-12-01", mes: "dezembro", valorInicial: 4790.88, poupanca: -613.03, taxa: 0.0093, valorFinal: 4835.39, rendimento: 44.52, anoDecorrido: 4.3, idade: 28.3 },

    // 2026
    { data: "2026-01-01", mes: "janeiro", valorInicial: 4837.19, poupanca: 1.79, taxa: 0.0093, valorFinal: 4882.13, rendimento: 44.95, anoDecorrido: 4.4, idade: 28.3 },
    { data: "2026-02-01", mes: "fevereiro", valorInicial: 3741.48, poupanca: -1140.65, taxa: 0.0093, valorFinal: 3776.25, rendimento: 34.76, anoDecorrido: 4.5, idade: 28.4 },
    { data: "2026-03-01", mes: "março", valorInicial: 2984.26, poupanca: -791.99, taxa: 0.0093, valorFinal: 3011.99, rendimento: 27.73, anoDecorrido: 4.6, idade: 28.5 },

    // Transição suave aprovada (Abril/2026 a Agosto/2026)
    { data: "2026-04-01", mes: "abril", valorInicial: 3011.99, poupanca: -450.00, taxa: 0.0093, valorFinal: 2585.81, rendimento: 23.82, anoDecorrido: 4.7, idade: 28.6 },
    { data: "2026-05-01", mes: "maio", valorInicial: 2585.81, poupanca: -450.00, taxa: 0.0093, valorFinal: 2155.67, rendimento: 19.86, anoDecorrido: 4.8, idade: 28.7 },
    { data: "2026-06-01", mes: "junho", valorInicial: 2155.67, poupanca: -400.00, taxa: 0.0093, valorFinal: 1772.00, rendimento: 16.33, anoDecorrido: 4.8, idade: 28.8 },
    { data: "2026-07-01", mes: "julho", valorInicial: 1772.00, poupanca: -400.00, taxa: 0.0093, valorFinal: 1384.76, rendimento: 12.76, anoDecorrido: 4.9, idade: 28.8 },
    { data: "2026-08-01", mes: "agosto", valorInicial: 1384.76, poupanca: -373.97, taxa: 0.0093, valorFinal: 1020.62, rendimento: 9.83, anoDecorrido: 5.0, idade: 28.9 },

    // Setembro/2026 (Último mês histórico fixo da planilha)
    { data: "2026-09-01", mes: "setembro", valorInicial: 1020.62, poupanca: -100.11, taxa: 0.0093, valorFinal: 1030.10, rendimento: 9.48, anoDecorrido: 5.1, idade: 29.0 },
];
