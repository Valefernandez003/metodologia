import { FC } from "react";
import { useSprintStore } from "../../../../../store/sprintStore";
import styles from "./ViewTareaSprint.module.css";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface Props {
    onClose: () => void;
}

export const ViewTareaSprint: FC<Props> = ({ onClose }) => {
    const tarea = useSprintStore.getState().activeTarea;

    if (!tarea) return null;

    return (
        <div className="overlay">
            <div className={styles.viewTarea_form}>
                <h3 className={styles.viewTarea_title}>{tarea.titulo}</h3>
                <p className={styles.viewTarea_text}><strong>Descripción:</strong> {tarea.descripcion}</p>
                <p className={styles.viewTarea_text}><strong>Estado:</strong> {tarea.estado}</p>
                <p className={styles.viewTarea_text}><strong>Fecha límite:</strong> {tarea.fechaLimite.slice(0, 10)}</p>
                <Stack className={styles.view_containButtons}>
                    <Button variant="contained" color="error" 
                    sx={{ width: "10rem", height: "2rem", borderRadius: "5px"}}
                    onClick={() => onClose()}>Cerrar</Button>
                </Stack>
            </div>
        </div>
    );
};
