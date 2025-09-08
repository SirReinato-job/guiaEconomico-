import { Outlet } from "react-router-dom";
import styled from "styled-components";

export default function ContainerGeral() {
  return (
    <Container>
      <NavContainer>
        <h1>aaaaaaaaaa</h1>
      </NavContainer>

      <MainContainer>
        <Outlet />
      </MainContainer>

      <Footer>
        <span>Footer</span>
        <Logo />
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
`;

const NavContainer = styled.div`
  grid-area: nav;
  background-color: red;
  color: white;
  padding: 1rem;
`;

const MainContainer = styled.div`
  grid-area: main;
  background-color: blue;
  overflow-y: auto;
  padding: 1rem;
`;

const Footer = styled.div`
  grid-area: footer;
  background-color: #333;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
`;

const Logo = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(to right, red, blue);
`;