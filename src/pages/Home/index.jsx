import styled from "styled-components";
import Card from "../../components/Card";
import GraficoComparativo from "../../components/CardComparativo";

export default function Home() {
    return (
        <ContainerGeralHome>
            <HeaderContainer>
                <Card $widthSm $heightSm>
                    <h2>Saldo</h2>
                    <p>R$ 4.250,00</p>
                </Card>
                <Card $widthSm $heightSm>
                    <h2>Entradas</h2>
                    <p>R$ 20,00</p>
                </Card>
                <Card $widthSm $heightSm>
                    <h2>Despesas</h2>
                    <p>R$ 120,00</p>
                </Card>
            </HeaderContainer>

            <ContainerMainCards>
                <Card>
                    <h2>Cartões</h2>
                    <p>Fixos</p>
                    <p>Total</p>
                </Card>
                <Card>
                    <h2>Financeiro do Mês 50/30/20 </h2>
                    <GraficoComparativo />
                </Card>
                <Card>
                    <h2>Essenciais</h2>
                    <p>Aluguel</p>
                    <p>Água</p>
                    <p>Manutenção</p>
                </Card>
                <Card>
                    <h2>Evitáveis</h2>
                    <p>Uber</p>
                    <p>Caixinhas</p>
                    <p>Alimentação fora de casa</p>
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
