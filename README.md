# 00 - Guia Econômico

## Visão Geral
O **Guia Econômico** é um dashboard financeiro pessoal, desenvolvido com foco em controle de gastos mensais, categorização, 
projeções futuras e visualização clara. Ele permite ao usuário acompanhar suas finanças de forma prática, com cards de resumo, 
gráficos de saldo diário e comparativos financeiros.

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Frontend | React.js + styled-components + Bootstrap |
| Backend | Node.js + Express.js (em desenvolvimento) |
| Banco de Dados | PostgreSQL (via Neon) |
| Hospedagem | Vercel (frontend) / Render ou Railway (backend alternativo) |

## Estrutura do Projeto

### Páginas Principais
- **Home**: visão geral do mês, saldo, entradas, despesas e gráficos de comparação.
- **Cartões**: resumo de cartões de crédito e lista de gastos.
- **Relatórios**: gráficos e projeções financeiras.
- **Comparativo**: análise entre categorias e distribuição 50/30/20.
- **Insights**: visualizações e dicas financeiras.
- **Configurações**: metas mensais e categorias personalizadas.

### Componentes Principais
- **App.jsx**: configuração do React Router com `AppRoutes`.
- **AppRoutes.jsx**: definição de rotas e páginas principais.
- **ContainerGeral.jsx**: layout principal com sidebar, navegação e footer.
- **Card.jsx**: componente genérico para exibir informações financeiras.
- **Home.jsx**: dashboard com cards de saldo, entradas, despesas e gráficos.
- **CardSaldoGrafico.jsx**: gráfico de linha do saldo diário.
- **GraficoComparativo.jsx**: gráfico de barras comparando distribuição financeira ideal e atual.
- **Cartoes.jsx**: visualização de cartões de crédito e lista de gastos.

### Serviços de Dados
- **gastosService.js**: busca os gastos do usuário de um JSON estático (`public/data/gastos.json`).
- **saldoService.js**: busca saldo diário de um JSON estático (`public/data/saldo.json`).

### Estrutura de Componentes
src/
├─ components/
│ ├─ Card.jsx
│ ├─ CardSaldoGrafico.jsx
│ └─ CardComparativo.jsx
├─ pages/
│ ├─ Home.jsx
│ ├─ Cartoes.jsx
│ ├─ Relatorios.jsx
│ ├─ Comparativo.jsx
│ ├─ Insights.jsx
│ └─ Configuracoes.jsx
├─ routes/
│ └─ AppRoutes.jsx
├─ services/
│ ├─ gastosService.js
│ └─ saldoService.js
├─ styles/
│ ├─ base/
│ │ ├─ theme.js
│ │ └─ GlobalStyle.js
├─ App.jsx
└─ main.jsx


### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicializa o projeto em modo desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Visualiza a build de produção localmente |
| `npm run lint` | Executa o ESLint para verificação de código |

### Instruções para Rodar Localmente

1. Clonar o repositório:
git clone <URL_DO_REPOSITORIO>

2. Instalar dependências:
npm install

3. Iniciar o servidor de desenvolvimento:
npm run dev

4. Acessar no navegador:
http://localhost:5173



