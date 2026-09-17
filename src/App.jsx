import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { MesProvider } from "./context/MesContext";
import { GastosProvider } from "./context/GastosContext";
import { SaldoProvider } from "./context/SaldoContext";
import { EssencialProvider } from "./context/EssencialContext";

function App() {
    return (
        <BrowserRouter>
            <MesProvider>
                <SaldoProvider>
                    <EssencialProvider>
                        <GastosProvider>
                            <AppRoutes />
                        </GastosProvider>
                    </EssencialProvider>
                </SaldoProvider>
            </MesProvider>
        </BrowserRouter>
    );
}

export default App;
