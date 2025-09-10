import styled from "styled-components";
import Card from "../../components/Card";

export default function Home({ }) {
    return (
        <ContainerGeralHome>
            <HeaderContainer>
                <Card $widthSm $heightSm>
                    <h2>Nubank - R$ 320,51</h2>
                    <p>Alura</p>
                    <p>Vivo</p>
                </Card>
                <Card $widthSm $heightSm>
                    <h2>BB - R$ 320,51</h2>
                    <p>Smat Fit</p>
                    <p>Gran</p>
                </Card>
                <Card $widthSm $heightSm>
                    <h2>Picpay - R$ 320,51</h2>
                    <p>Gastos da Nega</p>
                </Card>
            </HeaderContainer>

            <ContainerMainCards>
                <Card>
                    <h2>Financeiro do Mês - </h2>
                    <p>Entrada</p>
                    <p>Saída</p>
                    <p>Total</p>
                    <span>Vou colocar a espectativa para o método 50/30/20: 50% necessidades, 30% desejos, 20% poupança/investimento.</span>
                </Card>
                <Card>
                    <h2>Cartões</h2>
                    <p>Fixos</p>
                    <p>Total</p>
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
    )
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