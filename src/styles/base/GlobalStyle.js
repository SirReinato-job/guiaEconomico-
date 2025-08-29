import { createGlobalStyle } from 'styled-components'
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    font-family: 'Inter', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  img, video {
    max-width: 100%;
    display: block;
  }

  button {
    font: inherit;
    cursor: pointer;
  }
`

export default GlobalStyle