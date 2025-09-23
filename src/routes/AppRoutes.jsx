import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import ContainerGeral from '../pages/Outlet';
import Cartoes from '../pages/Cartoes';
import Relatorios from '../pages/Relatorios';
import Comparativo from '../pages/Comparativo';
import Insights from '../pages/Insights';
import Configuracoes from '../pages/Configuracoes';

const AppRoutes = () => {
    return (

        <Routes>
            <Route element={<ContainerGeral />} >
                <Route element={<Home />} path='/' />
                <Route element={<Cartoes />} path="/gastos-cartao" />
                <Route element={<Relatorios />} path="/relatorios" />
                <Route element={<Comparativo />} path="/comparativo" />
                <Route element={<Insights />} path="/insights" />
                <Route element={<Configuracoes />} path="/configuracoes" />

            </Route>
        </Routes>
    )
}
export default AppRoutes;