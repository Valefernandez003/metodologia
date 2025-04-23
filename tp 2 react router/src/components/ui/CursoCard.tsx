import { useNavigate } from "react-router-dom";
import { Curso } from "../../types/types"
import style from "./CursoCard.module.css";



type Props = {
    curso: Curso;
}

const CursoCard = ({curso}: Props) =>{
    const navigate = useNavigate();
    return(
        // Contenedor principal de la tarjeta de curso
        <div className={style.card}>
            <h2>{curso.nombre}</h2>
            <button className={style.button} onClick={() => navigate(`/estudiantes/${curso.id}`)}>Ver Estudiantes</button>
        </div>
    )
};

export default CursoCard;