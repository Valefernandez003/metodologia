import { useEffect, useState } from "react";
import { Curso } from "../../types/types";
import CursoCard from "../ui/CursoCard";
import { getCursos } from "../../http/api";
import style from "./CursosScreen.module.css";

const CursosScreen = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);

    useEffect(() => {

        //llama a la API para obtener los datos y setearlos
        getCursos().then(setCursos);
    }, []);

    return (
        <div className={style.container}>
            <h1>Cursos</h1>
            <div className={style.listaCursos}>
                {cursos.map((curso) => ( //render de los cursos
                    <CursoCard key={curso.id} curso={curso} />
                ))}
            </div>
        </div>
    );
};

export default CursosScreen;
