import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { GastosProvider } from "./context/GastosContext";
import { SaldoProvider } from "./context/SaldoContext";
import { EssencialProvider } from "./context/EssencialContext";

function App() {
    return (
        <BrowserRouter>
            <SaldoProvider>
                <EssencialProvider>
                    <GastosProvider>
                        <AppRoutes />
                    </GastosProvider>
                </EssencialProvider>
            </SaldoProvider>
        </BrowserRouter>
    );
}

export default App;
