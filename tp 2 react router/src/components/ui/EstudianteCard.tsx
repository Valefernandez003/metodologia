import { Estudiante } from "../../types/types";
import style from "./EstudianteCard.module.css";


type Props = {
    estudiante: Estudiante;
};

const EstudianteCard = ({ estudiante }: Props) => {
    return (
         // Contenedor principal de la tarjeta del estudiante
        <div className={style.card}>
        <p>Nombre: {estudiante.nombre}</p>
        <p>Edad: {estudiante.edad}</p>
        </div>
    );
};

export default EstudianteCard;
