// ContainerGeral.jsx
import { Outlet } from "react-router-dom";
import styled from "styled-components";

export default function ContainerGeral() {
  return (
    <Container>
      <NavContainer>
        <h1>Nav</h1>
        <h1>aaaaaaaaaaaaa</h1>
      </NavContainer>
      
      <MainContainer>
        <Outlet />
      </MainContainer>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 15% 83%;
  grid-template-areas: "nav main";
  grid-column-gap: 18px;
  height: 100vh;
`;

const NavContainer = styled.div`
  grid-area: nav;
  background-color: red;
`;

const MainContainer = styled.div`
  grid-area: main;
  background-color: blue;
  overflow-y: auto;
`;