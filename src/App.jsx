import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { GastosProvider } from './context/GastosContext'

function App() {

  return (
    <BrowserRouter>
      <GastosProvider>
        <AppRoutes />
      </GastosProvider>
    </BrowserRouter>
  )
}

export default App

