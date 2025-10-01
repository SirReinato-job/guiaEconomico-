import styled from "styled-components";
import { HeaderContainer } from "../Home";
import Card, { Titulos } from "../../components/Card";
import { useGastos } from "../../context/GastosContext";

export default function Cartoes() {
    const { gastos } = useGastos();
    const { getFaturaPorCartao } = useGastos();
    const faturaAtual = getFaturaPorCartao("atual");
    const faturaAnterior = getFaturaPorCartao("anterior");

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
            <HeaderContainer>
                <Card
                    $bgAlert
                    $widthSm
                    $heightSm
                    $bgClaro
                    titulo="Nubank"
                    destaque={`R$ ${
                        faturaAtual["Nubank"]
                            ? faturaAtual["Nubank"].toFixed(2)
                            : "0.00"
                    }`}
                    textTitulo={["Fatura Passada", "Limite Disponível"]}
                    textDescricao={[
                        `R$ ${faturaAnterior["Nubank"]?.toFixed(2) || "0.00"}`,
                        "R$ 2.600,00",
                    ]}
                />
                <Card
                    $bgAlert
                    $widthSm
                    $heightSm
                    $bgClaro
                    titulo="Picpay"
                    destaque={`R$ ${
                        faturaAtual["Picpay"]
                            ? faturaAtual["Picpay"].toFixed(2)
                            : "0.00"
                    }`}
                    textTitulo={["Fatura Passada", "Limite Disponível"]}
                    textDescricao={[
                        `R$ ${faturaAnterior["Picpay"]?.toFixed(2) || "0.00"}`,
                        "R$ 2.600,00",
                    ]}
                />
                <Card
                    $bgAlert
                    $widthSm
                    $heightSm
                    $bgClaro
                    titulo="BB"
                    destaque={`R$ ${
                        faturaAtual["Banco do Brasil"]
                            ? faturaAtual["Banco do Brasil"].toFixed(2)
                            : "0.00"
                    }`}
                    textTitulo={["Fatura Passada", "Limite Disponível"]}
                    textDescricao={[
                        `R$ ${
                            faturaAnterior["Banco do Brasil"]?.toFixed(2) ||
                            "0.00"
                        }`,
                        "R$ 2.600,00",
                    ]}
                />
            </HeaderContainer>
            <ListaGastos>
                {gastos.length > 0 ? (
                    gastos.map((gasto) => (
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
