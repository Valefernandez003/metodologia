import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../components/screens/Home";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/backlog" />} />
                <Route path="/backlog" element={<Home vista="backlog" />} />
                <Route path="/sprint/:id" element={<Home vista="sprint" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
