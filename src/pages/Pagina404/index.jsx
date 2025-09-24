import styled from "styled-components";
import { Titulos } from "../../components/Card";
import { StyledLink } from "../Outlet";

export default function Pagina404() {
  return (
    <Container404>
      <Titulos $tituloRoxo className="text">404</Titulos>
      <Mensagem>Ops... Página não encontrada</Mensagem>
      <Descricao>
        Parece que essa funcionalidade ainda está em construção ou o link está incorreto.
      </Descricao>
      <BotaoVoltarContainer>
        <StyledLink to="/" $bgBtn>
          Voltar para a página inicial
        </StyledLink>
      </BotaoVoltarContainer>
    </Container404>
  );
}

const Container404 = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.cardsBg || "#0d1b2a"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 32px;
  border-radius: 8px;
  .text{
    font-size: 6em;
  }
  
`;


const Mensagem = styled.h3`
  font-size: 2em;
  color: ${({ theme }) => theme.colors.textPrimary || "#ffffff"};
  margin: 16px 0;
`;

const Descricao = styled.p`
  font-size: 1em;
  color: ${({ theme }) => theme.colors.border || "#cccccc"};
  max-width: 500px;
`;

const BotaoVoltarContainer = styled.div`
  width: 40%;
  padding: 16px;
`