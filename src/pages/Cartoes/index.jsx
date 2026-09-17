import styled from "styled-components";
import { HeaderContainer } from "../Home";
import Card, { Titulos } from "../../components/Card";
import { useGastos } from "../../context/GastosContext";
import { useState } from "react";
import { parseCurrency } from "../../utils/currencyUtils";
import { useMes } from "../../context/MesContext";

export default function Cartoes() {
    const { getFaturaPorCartao, getGastosDoCiclo } = useGastos();
    const {
        nomeMesAno,
        mesReferencia,
        estaPago,
        confirmarMesPago,
        avancarMes,
        voltarMes,
    } = useMes();

    // estado para controlar ciclo ativo
    const [ciclo, setCiclo] = useState("atual");

    const fatura = getFaturaPorCartao(ciclo, mesReferencia);
    const gastos = ["Nubank", "Picpay", "Banco do Brasil"].map((cartao) => ({
        cartao,
        valor: fatura[cartao] ? fatura[cartao].toFixed(2) : "0.00",
    }));

    // lista detalhada dos gastos do ciclo ativo
    const gastosDoCiclo = getGastosDoCiclo("Nubank", ciclo, mesReferencia)
        .concat(getGastosDoCiclo("Picpay", ciclo, mesReferencia))
        .concat(getGastosDoCiclo("Banco do Brasil", ciclo, mesReferencia));

    return (
        <ContainerLista>
            <HeaderNavegacaoMes>
                <BotaoNavegacao onClick={voltarMes} title="Mês anterior">
                    ◀
                </BotaoNavegacao>
                <Titulos $titulo $tituloRoxo>
                    {nomeMesAno}
                </Titulos>
                <BotaoNavegacao onClick={avancarMes} title="Próximo mês">
                    ▶
                </BotaoNavegacao>
            </HeaderNavegacaoMes>

            <BarraStatusMes>
                {estaPago ? (
                    <BadgePago>✓ Todas as contas deste mês foram pagas</BadgePago>
                ) : (
                    <BotaoConfirmarPago onClick={confirmarMesPago}>
                        ✓ Confirmar tudo pago e avançar mês
                    </BotaoConfirmarPago>
                )}
            </BarraStatusMes>

            {/* Filtro de ciclo */}
            <Filtro>
                <button
                    className={ciclo === "atual" ? "ativo" : ""}
                    onClick={() => setCiclo("atual")}
                >
                    Atual
                </button>
                <button
                    className={ciclo === "anterior" ? "ativo" : ""}
                    onClick={() => setCiclo("anterior")}
                >
                    Anterior
                </button>
                <button
                    className={ciclo === "proximo" ? "ativo" : ""}
                    onClick={() => setCiclo("proximo")}
                >
                    Próximo
                </button>
            </Filtro>

            <HeaderContainer>
                {gastos.map((g) => (
                    <Card
                        key={g.cartao}
                        $bgAlert
                        $widthSm
                        $heightSm
                        $bgClaro
                        titulo={g.cartao}
                        destaque={`R$ ${g.valor}`}
                        textTitulo={["Fatura", "Limite Disponível"]}
                        textDescricao={[
                            `Ciclo: ${ciclo}`,
                            "R$ 2.600,00", // mock do limite
                        ]}
                    />
                ))}
            </HeaderContainer>

            <ListaGastos>
                {gastosDoCiclo.length > 0 ? (
                    gastosDoCiclo.map((gasto) => (
                        <ItemGasto key={gasto.id}>
                            <Coluna>{gasto.data}</Coluna>
                            <Coluna>
                                R$ {parseCurrency(gasto.valor).toFixed(2)}
                            </Coluna>
                            <Coluna>{gasto.cartao}</Coluna>
                            <Coluna tipo={gasto.tipo}>{gasto.tipo}</Coluna>
                            <Coluna>
                                {gasto.categoria}
                                {gasto.parcela ? ` (${gasto.parcela})` : ""}
                            </Coluna>
                            <BotaoEditar>Editar</BotaoEditar>
                        </ItemGasto>
                    ))
                ) : (
                    <p style={{ color: "#ccc", textAlign: "center" }}>
                        Nenhum gasto registrado.
                    </p>
                )}
            </ListaGastos>
        </ContainerLista>
    );
}

const ContainerLista = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 8px;
    width: 100%;
    padding: 8px;
    border-radius: 16px;
    background-color: ${({ theme }) => theme.colors.cardsBg};
`;

const ListaGastos = styled.div`
    width: 100%;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
    overflow-y: auto;
    padding-right: 4px;

    scrollbar-width: thin;
    scrollbar-color: #820ad1 transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #820ad1;
        border-radius: 8px;
        border: 2px solid transparent;
        background-clip: content-box;
    }
`;

const ItemGasto = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.cardItemBg || "#0d1b2a"};
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Coluna = styled.div`
    flex: 1;
    font-size: 0.85em;
    font-weight: ${({ tipo }) => (tipo ? "bold" : "normal")};
    color: ${({ tipo }) => {
        if (tipo === "Essencial") return "#ff6b6b";
        if (tipo === "Desejo") return "#f9c74f";
        if (tipo === "Poupança") return "#43aa8b";
        return "#ffffff";
    }};
`;

const BotaoEditar = styled.button`
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8em;

    &:hover {
        background-color: ${({ theme }) => theme.colors.hoverBg || "#1a2636"};
    }
`;

const Filtro = styled.div`
    display: flex;
    gap: 12px;
    margin: 12px 0;

    button {
        padding: 6px 12px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        background-color: ${({ theme }) => theme.colors.cardsBg};
        color: ${({ theme }) => theme.colors.textPrimary};
        font-weight: bold;

        &.ativo {
            background-color: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.surface};
        }
    }
`;

const HeaderNavegacaoMes = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 4px;
`;

const BotaoNavegacao = styled.button`
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #00b3ff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;

    &:hover {
        background: #00b3ff;
        color: #ffffff;
        transform: scale(1.1);
    }
`;

const BarraStatusMes = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
`;

const BotaoConfirmarPago = styled.button`
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border: none;
    padding: 8px 18px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9em;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
    }
`;

const BadgePago = styled.div`
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 6px 14px;
    border-radius: 16px;
    font-weight: bold;
    font-size: 0.85em;
    display: flex;
    align-items: center;
    gap: 6px;
`;
