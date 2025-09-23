import styled from "styled-components";

export default function Card({ children, titulo, destaque, $bgAlert, textTitulo, textDescricao, ...props }) {
  return (
    <Container {...props}>
      <HeaderCard>
        <Titulos>
          {titulo}
        </Titulos>
        <Destaque $bgAlert={$bgAlert}>{destaque}</Destaque>
      </HeaderCard>
      <CardCorpoDescricao>
        {Array.isArray(textTitulo) && Array.isArray(textDescricao)
          ? textTitulo.map((tituloItem, index) => (
            <LinhaDescricao key={index}>
              <TextTitulo>{tituloItem}</TextTitulo>
              <TextDescricao>{textDescricao[index]}</TextDescricao>
            </LinhaDescricao>
          ))
          : (
            <LinhaDescricao>
              <TextTitulo>{textTitulo}</TextTitulo>
              <TextDescricao>{textDescricao}</TextDescricao>
            </LinhaDescricao>
          )}
      </CardCorpoDescricao>
      {children}
    </Container>
  );
}

const Container = styled.div`
    width: ${props => props.$widthSm ? '32%' : '48%'};
    height: ${props => props.$heightSm ? '150px' : '220px'};
    background-color: ${({ theme }) => theme.colors.cardsBg};
    border-radius: 16px;
    padding: ${props => props.$heightSm ? '8px 16px' : '16px'};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: transform 0.2s;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    &:hover {
        transform: translateY(-1.5px);
    }
`;

const HeaderCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Titulos = styled.h2`
    font-size: 1.8em;
    letter-spacing: .08em;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.secondary};
    white-space: nowrap;
    
`;

const Destaque = styled.h2`
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 1.2em;
    font-family: "Bebas Neue", sans-serif;
    font-weight: bold;
    letter-spacing: .15em;
    white-space: nowrap;
     background: ${({ $bgAlert }) =>
    $bgAlert ? "linear-gradient(to right, #820ad1, #00b3ff)" : "transparent"};
    color: ${({ theme }) => theme.colors.valor};
`;

const CardCorpoDescricao = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`
const LinhaDescricao = styled.div`
width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 4px; */
`;

const TextTitulo = styled.h3`
  font-size: .9em;
  letter-spacing: .05em;
  font-weight: bold;

`
const TextDescricao = styled.p`
  font-size: .8em;
  letter-spacing: .05em;
  color: ${({ theme }) => theme.colors.border};
`;