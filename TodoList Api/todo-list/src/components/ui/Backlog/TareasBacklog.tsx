import { FC, useState } from "react";
import { FaArrowRight, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useBacklogStore } from "../../../store/backlogStore";
import { useSprintStore } from "../../../store/sprintStore";
import Swal from "sweetalert2";
import { API_URL } from "../../../utils/constantes";
import styles from "./TareasBacklog.module.css";
import { ITarea } from "../../../types/Tarea/ITarea";
import { deleteTareaBacklogController } from "../../../data/backlogController";

interface ITareasBackLogProps {
    tarea: ITarea;
    updateTarea: () => void;
    deleteTarea: () => void;
    viewTarea: () => void;
}

export const TareasBacklog: FC<ITareasBackLogProps> = ({
    tarea,
    updateTarea,
    viewTarea
}) => {
    const [selectedSprintId, setSelectedSprintId] = useState("");

    const handleEditTarea = () => {
        useBacklogStore.getState().setActiveTarea(tarea);
        updateTarea();
    };

    const handleDeleteTarea = () => {
        useBacklogStore.getState().setActiveTarea(tarea);
        
        Swal.fire({
            title: "¿Estás seguro?",
            text: `Esta tarea será eliminada: "${tarea.titulo}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const tareaId = tarea._id;
                    useBacklogStore.getState().removeTarea(tareaId);
                    await deleteTareaBacklogController(tareaId); 
                    useBacklogStore.getState().clearActiveTarea(); 
                    Swal.fire("Eliminada", "La tarea fue eliminada correctamente", "success");
                } catch (error) {
                    console.error("Error al eliminar tarea:", error);
                    Swal.fire("Error", "No se pudo eliminar la tarea", "error");
                }
            }
        });
    };
    
    const handleViewTarea = () => {
        useBacklogStore.getState().setActiveTarea(tarea);
        viewTarea();
    };

    const handleMoverAlSprint = async (tarea: any) => {
        if (!selectedSprintId) return alert("Selecciona un sprint");
    
        try {
            
            await fetch(`${API_URL}/sprints/${selectedSprintId}/add-task/${tarea._id}`, {
                method: "PUT",
            });
    
            await fetch(`${API_URL}/backlog/remove-task/${tarea._id}`, {
                method: "PUT",
            });
    
            useSprintStore.getState().createTareaSprint(tarea, selectedSprintId);
            useBacklogStore.getState().removeTarea(tarea._id);
    
            setSelectedSprintId("");
    
        } catch (error) {
            console.error("Error al mover tarea al sprint:", error);
        }
    };

    return (
        <div className={styles.tareasBacklog_container}>
            <p><b>{tarea.titulo}:</b> {tarea.descripcion}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: ".2rem" }}>
                <button
                    className={styles.tareasBacklog_input}
                    onClick={() => handleMoverAlSprint(tarea)}
                    disabled={!selectedSprintId}
                >
                    Enviar a <FaArrowRight />
                </button>
                <select
                    value={selectedSprintId}
                    onChange={(e) => setSelectedSprintId(e.target.value)}
                    className={styles.tareasBacklog_input}
                >
                    <option value="">Seleccione un sprint</option>
                    {useSprintStore.getState().sprints.map((spr) => (
                        <option key={spr._id} value={spr._id}>{spr.nombre}</option>
                    ))}
                </select>
                <button className={styles.tareasBacklog_buttonAction} onClick={handleViewTarea}><FaEye /></button>
                <button className={styles.tareasBacklog_buttonAction} onClick={handleEditTarea}><FaEdit /></button>
                <button className={styles.tareasBacklog_buttonAction} onClick={handleDeleteTarea}><FaTrash /></button>
            </div>
        </div>
    );
};


