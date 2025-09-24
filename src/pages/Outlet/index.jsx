import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

export default function ContainerGeral() {
  return (
    <Container>
      <NavContainer>
        <NavCardContainer>
          <Link to="/" style={{ textDecoration: 'none' }} >
          <Logo />
          </Link>
          <StyledLink to="/">➕ Novo Gasto</StyledLink>
          <StyledLink to="/gastos-cartao">📁 Gastos por Cartão</StyledLink>
          <StyledLink to="/relatorios">📈 Relatórios</StyledLink>
          <StyledLink to="/comparativo">🧮 Comparativo</StyledLink>
          <StyledLink to="/insights">🧠 Insights Financeiros</StyledLink>
          <StyledLink to="/configuracoes">⚙️ Configurações</StyledLink>
        </NavCardContainer>
      </NavContainer>

      <MainContainer>
        <Outlet />
      </MainContainer>

      <Footer>
        <p className="textFooter">Desenvolvido by SirReinato</p>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "nav main"
    "footer footer";
  height: 100vh;
  box-sizing: border-box;
`;

const NavContainer = styled.div`
  display: flex;
  grid-area: nav;
  box-sizing: border-box;
  color: white;
  padding: 60px 8px;
`;
const NavCardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 16px 8px;
  background-color: ${({ theme }) => theme.colors.cardsBg};
  border-radius: 16px;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  background-color: ${props => props.$bgBtn ? '#777777' : 'transparent'};
  padding: ${props => props.$bgBtn ? '12px 16px' : '4px 12px'};
  border-radius: 8px;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: center;
  box-sizing: border-box;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textOnPrimary};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MainContainer = styled.div`
  grid-area: main;
  overflow-y: auto;
  padding: 1rem;
`;

const Footer = styled.div`
  grid-area: footer;
  background-color: ${({ theme }) => theme.colors.cardsBg};
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  .textFooter {
    padding-top: 5px;
    text-align: center;
    background: linear-gradient(to right, #820ad1, #00b3ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
  }
`;

const Logo = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(to right, #820ad1, #00b3ff);
`;