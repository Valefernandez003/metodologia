import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Curso } from "../../types/types";
import EstudianteCard from "../ui/EstudianteCard";
import { getCursoPorId} from "../../http/api";
import style from "./EstudiantesScreen.module.css";

const EstudiantesScreen = () => {
    const { idCurso } = useParams<{ idCurso: string }>();
    const [curso, setCurso] = useState<Curso | null>(null);

    useEffect(() => {
        if (idCurso) {
        getCursoPorId(idCurso).then(setCurso);
        }
    }, [idCurso]);

    return (
        <div className={style.container}>
            <h1>Estudiantes del Curso {curso?.nombre}</h1>
            {/* Contenedor de las tarjetas de estudiantes */}
            <div className={style.listaEstudiantes}> 
                {curso?.estudiantes?.length ? (
                curso.estudiantes.map((est) => (
                    <EstudianteCard key={est.id} estudiante={est} />
                ))
                ) : (
                //mensaje por si no hay estudiantes o no se encuentran
                <p>No se encontraron estudiantes.</p>
                )}
            </div>
    </div>
    );
};

export default EstudiantesScreen;
