import { FC } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styles from "./ViewTarea.module.css";
import { useBacklogStore } from "../../../../../store/backlogStore";


interface IViewTareaProps {
    onClose: () => void;
}

export const ViewTarea: FC<IViewTareaProps> = ({onClose}) => {
    const tarea = useBacklogStore.getState().activeTarea;

    return (
        <div className="overlay">
            <div className={styles.view_container}>
                <h3 className={styles.view_title}>{tarea?.titulo}</h3>
                <div>
                    <p>{`Descripción: `}{tarea?.descripcion}</p>
                </div>
                <div>
                    <p>{"Fecha Límite: "}{tarea?.fechaLimite.slice(0, 10)}</p>
                </div>
                <Stack className={styles.view_containButtons}>
                    <Button variant="contained" color="error" 
                    sx={{ width: "10rem", height: "2rem", borderRadius: "5px"}}
                    onClick={() => onClose()}>Cerrar</Button>
                </Stack>
            </div>
        </div>
    )
}