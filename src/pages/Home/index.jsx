import styled from "styled-components";
import Card from "../../components/Card";
import GraficoComparativo from "../../components/CardComparativo";
import { CardSaldoGrafico } from "../../components/CardSaldoGrafico";
import { useResumoFinanceiro } from "../../hooks/useResumoFinanceiro";
import { useSaldo } from "../../context/SaldoContext";
import { useResumoCartoes } from "../../hooks/useResumoCartoes";
import { useResumoEssenciais } from "../../hooks/useResumoEssencial";

export default function Home() {
    const { nomeCartao, valorPorCartao, valorTotal } = useResumoCartoes();
    const { nomes, valores, destaque } = useResumoEssenciais();

    const { saldoLiquido } = useResumoFinanceiro();
    const saldoFormatado = `R$ ${saldoLiquido}`;
    const { getEntradasDoMes } = useSaldo();
    const entradasFormatadas = `R$ ${getEntradasDoMes()}`;

    return (
        <ContainerGeralHome>
            <HeaderContainer>
                <Card
                    $widthSm
                    $heightSm
                    $bgAlert
                    titulo="Saldo"
                    destaque={saldoFormatado}
                >
                    <CardSaldoGrafico />
                </Card>
                <Card
                    $widthSm
                    $heightSm
                    $bgAlert
                    titulo="Entradas"
                    destaque={entradasFormatadas}
                >
                    <CardSaldoGrafico />
                </Card>
                <Card
                    $widthSm
                    $heightSm
                    $bgAlert
                    titulo="Despesas"
                    destaque={valorTotal}
                >
                    <CardSaldoGrafico />
                </Card>
            </HeaderContainer>

            <ContainerMainCards>
                <Card
                    $bgAlert
                    titulo="Cartões"
                    destaque={valorTotal}
                    textTitulo={nomeCartao}
                    textDescricao={valorPorCartao}
                />
                <Card $bgAlert titulo="Financeiro do Mês" destaque="50/30/20">
                    <GraficoComparativo />
                </Card>
                <Card
                    $bgAlert
                    titulo="Essenciais"
                    destaque={destaque}
                    textTitulo={nomes}
                    textDescricao={valores}
                />

                <Card
                    $bgAlert
                    titulo="Evitáveis"
                    destaque="R$ 450,00"
                    textTitulo={[
                        "Uber",
                        "Caixinhas",
                        "Alimentação fora de casa",
                    ]}
                    textDescricao={["R$ 150,00", "R$ 50,00", "R$ 250,00"]}
                ></Card>
            </ContainerMainCards>
        </ContainerGeralHome>
    );
}

const ContainerGeralHome = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    height: 100%;
`;
export const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 25%;
`;

const ContainerMainCards = styled.div`
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
    align-items: center;
    row-gap: 16px;
    height: 75%;
`;
