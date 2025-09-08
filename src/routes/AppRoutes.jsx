import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import ContainerGeral from '../pages/Outlet';

const AppRoutes = () => {
    return (

        <Routes>
            <Route element={<ContainerGeral />} >
                <Route element={<Home />} path='/' />
            </Route>
        </Routes>
    )
}
export default AppRoutes;