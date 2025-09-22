import styled from "styled-components";
import Card from "../../components/Card";

export default function Home({ }) {
    return (
        <ContainerGeralHome>
            <HeaderContainer>
                <Card $widthSm $heightSm $bgAlert
                    titulo="Nubank"
                    destaque="R$ 320,51"
                >
                    <p>Alura</p>
                    <p>Vivo</p>
                </Card>
                <Card $widthSm $heightSm $bgAlert
                    titulo="BB"
                    destaque="R$ 320,51"
                >

                    <p>Smat Fit</p>
                    <p>Gran</p>
                </Card>
                <Card $widthSm $heightSm $bgAlert
                    titulo="Picpay"
                    destaque="R$ 320,51"
                >
                    <p>Gastos da Nega</p>
                </Card>
            </HeaderContainer>

            <ContainerMainCards>
                <Card $bgAlert
                    titulo="Financeiro do Mês"
                    destaque="R$ 1.200,00"
                >
                    <CardFlex>
                        <p>Entrada</p>
                        <p>Saída</p>
                    </CardFlex>
                    <label>Necessidades</label>
                    <input type="range" min={0} max={50} />
                    <label>Livre</label>
                    <input type="range" min={0} max={50} />
                    <label>Reserva</label>
                    <input type="range" min={0} max={50} />
                    <span>50/30/20: 50% necessidades, 30% desejos, 20% poupança/investimento.</span>
                </Card>
                <Card $bgAlert
                    titulo="Cartões"
                    destaque="R$ 961,00">
                    <p>Fixos</p>
                    <p>Total</p>
                </Card>
                <Card $bgAlert
                    titulo="Essenciais"
                    destaque="R$ 1.040,00">
                    <p>Aluguel</p>
                    <p>Água</p>
                    <p>Manutenção</p>
                </Card>
                <Card $bgAlert
                    titulo="Evitáveis"
                    destaque="R$ 450,00">
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

const CardFlex = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    `;