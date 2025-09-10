import { Outlet } from "react-router-dom";
import styled from "styled-components";

export default function ContainerGeral() {
  return (
    <Container>
      <NavContainer>
        <div className="bg-card">
          <Logo />
          <span>Novo Gasto</span>
          <span>Menu Item 2</span>
          <span>Menu Item 3</span>
          <span>Menu Item 4</span>
        </div>
      </NavContainer>

      <MainContainer>
        <Outlet />
      </MainContainer>

      <Footer>
        <p>Desenvolvido by SirReinato</p>
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

  .bg-card{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    padding: 16px 8px;
    background-color: ${({ theme }) => theme.colors.cardsBg};
    border-radius: 16px;
  }
`;

const MainContainer = styled.div`
  grid-area: main;
  overflow-y: auto;
  padding: 1rem;
`;

const Footer = styled.div`
  grid-area: footer;
  background-color: #333;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
 
`;

const Logo = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(to right, #820ad1, #00b3ff);
`;