import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { GastosProvider } from "./context/GastosContext";
import { SaldoProvider } from "./context/SaldoContext";

function App() {
    return (
        <BrowserRouter>
            <SaldoProvider>
                <GastosProvider>
                    <AppRoutes />
                </GastosProvider>
            </SaldoProvider>
        </BrowserRouter>
    );
}

export default App;
