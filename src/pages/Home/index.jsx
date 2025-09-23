import styled from "styled-components";
import Card from "../../components/Card";
import GraficoComparativo from "../../components/CardComparativo";

export default function Home() {
    return (
        <ContainerGeralHome>
            <HeaderContainer>
                <Card $widthSm $heightSm $bgAlert
                    titulo="Saldo"
                    destaque="R$ 4.250,00">
                </Card>
                <Card $widthSm $heightSm $bgAlert
                    titulo="Entradas"
                    destaque="R$ 20,00"
                >

                </Card>
                <Card $widthSm $heightSm $bgAlert
                    titulo="Despesas"
                    destaque="R$ R$ 120,00" >

                </Card>
            </HeaderContainer>

            <ContainerMainCards>
                <Card $bgAlert
                    titulo="Cartões"
                    destaque="R$ 1.200,00"
                    textTitulo={["Nubank", "Picpay", "Banco do Brasil"]}
                    textDescricao={["R$ 400,00", "R$ 300,00", "R$ 500,00"]}
                    >
                </Card>
                <Card $bgAlert
                    titulo="Financeiro do Mês"
                    destaque="50/30/20">
                    <GraficoComparativo />
                </Card>
                <Card $bgAlert
                    titulo="Essenciais"
                    destaque="R$ 800,00"
                    textTitulo={["Aluguel", "Água", "Manutenção"]}
                    textDescricao={["R$ 450,00", "R$ 80,00", "R$ 270,00"]}
                    />
                <Card $bgAlert
                    titulo="Evitáveis"
                    destaque="R$ 450,00"
                    textTitulo={["Uber", "Caixinhas", "Alimentação fora de casa"]}
                    textDescricao={["R$ 150,00", "R$ 50,00", "R$ 250,00"]}
                    >
                </Card>
            </ContainerMainCards>
        </ContainerGeralHome>
    );
}

const ContainerGeralHome = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 8px 24px;
`;
const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
`;

const ContainerMainCards = styled.div`
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
    align-items: center;
    row-gap: 16px;
    `;

