import { useSprintStore } from '../../../store/sprintStore';
import { FaEye, FaEdit, FaTrash, FaArrowRight, FaPlus } from "react-icons/fa";
import { useState } from 'react';
import { ViewTareaSprint } from './Modals/ViewTareaSprint/ViewTareaSprint';
import { useBacklogStore } from '../../../store/backlogStore';
import { API_URL } from '../../../utils/constantes';
import styles from './TareaSprint.module.css'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { deleteTareaFromSprintController } from '../../../data/sprintController';
import Swal from 'sweetalert2';
import { TareaSprintModal } from './Modals/TareaSprintModal';

const isFechaLimiteProxima = (fechaLimite: string): boolean => {
    const fechaActual = new Date();
    const fechaLimiteDate = new Date(fechaLimite);

    fechaActual.setHours(0, 0, 0, 0);
    fechaLimiteDate.setHours(0, 0, 0, 0);

    // Calcular la diferencia en días
    const diffTime = fechaLimiteDate.getTime() - fechaActual.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    return diffDays >= 0 && diffDays <= 3;
};

export const TareasSprint = () => {
    const sprint = useSprintStore(state => state.activeSprint);

    const [showModal, setShowModal] = useState<null | "create" | "update">(null);
    const [showViewTareaSprint, setShowViewTareaSprint] = useState(false);

    const estados = [
        { key: 'pendiente', label: 'Pendiente' },
        { key: 'en_progreso', label: 'En Progreso' },
        { key: 'completado', label: 'Completado' }
    ];

    if (!sprint) return <p>No hay sprint activo</p>;

    const handleDeleteTarea = async (sprintId: string) => {
        const tarea = useSprintStore.getState().activeTarea;
        if (!tarea) return;

        Swal.fire({
            title: "¿Estás seguro?",
            text: `Esta tarea será eliminada: "${tarea.titulo}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    const tareaId = tarea._id;
                    useSprintStore.getState().removeTareaSprint(sprintId, tareaId);
                    await deleteTareaFromSprintController(tareaId);
                    useSprintStore.getState().clearActiveTarea();
                    Swal.fire("Eliminada", "La tarea fue eliminada correctamente", "success");
                } catch (error) {
                    console.error("Error al eliminar tarea:", error);
                    Swal.fire("Error", "No se pudo eliminar la tarea", "error");
                }
            }
        });
    };

    const handleMoverEstado = async (tarea: any) => {
        const estados = ['pendiente', 'en_progreso', 'completado'];
        const estadoActualIndex = estados.indexOf(tarea.estado);
        const siguienteEstado = estados[(estadoActualIndex + 1) % estados.length];
    
        try {
            await fetch(`${API_URL}/tasks/${tarea._id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: siguienteEstado }),
            });
    
            const sprintId = useSprintStore.getState().activeSprint?._id;
            if (!sprintId) return;
    
            useSprintStore.getState().updateTareaSprint(sprintId, {
                ...tarea,
                estado: siguienteEstado
            });
    
        } catch (error) {
            console.error("Error al mover el estado de la tarea:", error);
        }
    };
    
    const handleMoverAlBacklog = async (tarea: any, sprintId: string) => {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres mover "${tarea.titulo}" al Backlog?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, mover',
            cancelButtonText: 'Cancelar'
        });
    
        if (!confirmacion.isConfirmed) return;
    
        try {
            await fetch(`${API_URL}/sprints/${sprintId}/remove-task-from-sprint/${tarea._id}`, {
                method: "PUT"
            });
    
            useBacklogStore.getState().createTarea(tarea);
            useSprintStore.getState().removeTareaSprint(sprintId, tarea._id);
    
            Swal.fire({
                icon: 'success',
                title: 'Tarea enviada al Backlog',
                text: `"${tarea.titulo}" fue movida correctamente.`,
                confirmButtonColor: '#3085d6'
            });
    
        } catch (error) {
            console.error("Error al mover la tarea al backlog:", error);
            Swal.fire("Error", "No se pudo mover la tarea al backlog", "error");
        }
    };

    return (
        <div className={styles.tareaSprint_container}>
            <h2 className={styles.tareaSprint_title}>
                Nombre de la sprint:  <strong>{sprint.nombre}</strong>
            </h2>
            <Stack direction="row" spacing={20} className={styles.tareaSprint_header}>
                <h3 className={styles.tareaSprint_subtitle}>Tareas en la sprint</h3>
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ width: "10rem", height: "2rem", borderRadius: "5px" }}
                    onClick={() => setShowModal("create")}
                >
                    Crear tarea <FaPlus />
                </Button>
            </Stack>
            <div className={styles.tareaSprint_sections}>
                {estados.map(({ key, label }) => (
                    <div key={key} className={styles.tareaSprint_column}>
                        <h3 style={{ fontSize: "2rem" }}>{label}</h3>
                        {sprint.tareas
                            .filter(t => t.estado === key)
                            .map(tarea => (
                                <div
                                    key={tarea._id}
                                    className={`${styles.tareaSprint_card} ${isFechaLimiteProxima(tarea.fechaLimite) && tarea.estado !== 'completado' ? styles.resaltado : ''}`}
                                >
                                    <p><strong>Título:</strong> {tarea.titulo}</p>
                                    <p><strong>Descripción:</strong> {tarea.descripcion}</p>
                                    <p><strong>Fecha límite:</strong> {tarea.fechaLimite.slice(0, 10)}</p>

                                    <div className={styles.tareaSprint_Actions}>
                                        <button className={styles.tareaSprint_buttonEnviar} onClick={() => handleMoverAlBacklog(tarea, sprint._id)}>
                                            Enviar al Backlog <FaPlus />
                                        </button>
                                        <button className={styles.tareaSprint_buttonEstado} onClick={() => handleMoverEstado(tarea)}>
                                            {tarea.estado} <FaArrowRight />
                                        </button>
                                        <button className={styles.tareaSprint_buttonAction} onClick={() => {
                                            useSprintStore.getState().setActiveTarea(tarea);
                                            setShowViewTareaSprint(true);
                                        }}>
                                            <FaEye />
                                        </button>
                                        <button className={styles.tareaSprint_buttonAction} onClick={() => {
                                            useSprintStore.getState().setActiveTarea(tarea);
                                            setShowModal("update");
                                        }}>
                                            <FaEdit />
                                        </button>
                                        <button className={styles.tareaSprint_buttonAction} onClick={() => {
                                            useSprintStore.getState().setActiveTarea(tarea);
                                            handleDeleteTarea(sprint._id);
                                        }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
            {showModal && (<TareaSprintModal mode={showModal} sprintId={sprint._id} onClose={() => setShowModal(null)} /> )}
            {showViewTareaSprint && (<ViewTareaSprint onClose={() => setShowViewTareaSprint(false)} />)}
        </div>
    );
};

