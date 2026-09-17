import styled from "styled-components";
import { useGastos } from "../../context/GastosContext";

export default function ListaGanhosMozi() {
    const { getGanhosMozi } = useGastos();
    const { porCartao = {}, totalGeral = 0 } = getGanhosMozi
        ? getGanhosMozi()
        : {};

    const listaCartoes = Object.entries(porCartao)
        .map(([cartao, valor]) => ({ cartao, valor }))
        .filter((item) => item.valor > 0);

    return (
        <Container>
            <HeaderGanhos>
                <TagGanhos>Ganhos+</TagGanhos>
                <TotalGeralTexto>
                    Geral: R${" "}
                    {totalGeral.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </TotalGeralTexto>
            </HeaderGanhos>

            {listaCartoes.length > 0 ? (
                <ListaCartoes>
                    {listaCartoes.map((item) => (
                        <LinhaCartao key={item.cartao}>
                            <NomeCartao>{item.cartao}</NomeCartao>
                            <ValorCartao>
                                R${" "}
                                {item.valor.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </ValorCartao>
                        </LinhaCartao>
                    ))}
                </ListaCartoes>
            ) : (
                <MensagemVazia>Sem gastos da Mozi no ciclo</MensagemVazia>
            )}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
    width: 100%;
`;

const HeaderGanhos = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const TagGanhos = styled.span`
    font-size: 0.85em;
    font-weight: bold;
    letter-spacing: 0.08em;
    background: linear-gradient(135deg, #ec4899, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
`;

const TotalGeralTexto = styled.span`
    font-size: 0.85em;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.success || "#10b981"};
`;

const ListaCartoes = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 56px;
    overflow-y: auto;
    scrollbar-width: thin;
`;

const LinhaCartao = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9em;
`;

const NomeCartao = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary || "#94a3b8"};
    font-weight: 500;
`;

const ValorCartao = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary || "#f8fafc"};
    font-weight: 600;
`;

const MensagemVazia = styled.span`
    font-size: 0.85em;
    color: ${({ theme }) => theme.colors.textSecondary || "#64748b"};
    font-style: italic;
    padding-top: 4px;
`;
