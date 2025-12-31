import styled from "styled-components";
import { HeaderContainer } from "../Home";
import Card, { Titulos } from "../../components/Card";
import { useGastos } from "../../context/GastosContext";
import { useState } from "react";

export default function Cartoes() {
    const { getFaturaPorCartao, getGastosDoCiclo } = useGastos();

    // estado para controlar ciclo ativo
    const [ciclo, setCiclo] = useState("atual");

    const fatura = getFaturaPorCartao(ciclo);
    const gastos = ["Nubank", "Picpay", "Banco do Brasil"].map((cartao) => ({
        cartao,
        valor: fatura[cartao] ? fatura[cartao].toFixed(2) : "0.00",
    }));

    // lista detalhada dos gastos do ciclo ativo
    const gastosDoCiclo = getGastosDoCiclo("Nubank", ciclo)
        .concat(getGastosDoCiclo("Picpay", ciclo))
        .concat(getGastosDoCiclo("Banco do Brasil", ciclo));

    const hoje = new Date();
    const nomeMesAno = hoje.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });

    return (
        <ContainerLista>
            <Titulos $titulo $tituloRoxo>
                {nomeMesAno.charAt(0).toUpperCase() + nomeMesAno.slice(1)}
            </Titulos>

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
                            <Coluna>R$ {Number(gasto.valor).toFixed(2)}</Coluna>
                            <Coluna>{gasto.cartao}</Coluna>
                            <Coluna tipo={gasto.tipo}>{gasto.tipo}</Coluna>
                            <Coluna>{gasto.categoria}</Coluna>
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
