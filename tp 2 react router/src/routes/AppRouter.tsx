import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CursosScreen from "../components/screens/CursosScreen";
import EstudiantesScreen from "../components/screens/EstudiantesScreen";


function AppRouter() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/cursos" />} />
            <Route path="/cursos" element={<CursosScreen />} />
            <Route path="/estudiantes/:idCurso" element={<EstudiantesScreen />} />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;