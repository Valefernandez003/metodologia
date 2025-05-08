import {FC} from 'react';
import { ISprint } from '../../../types/Sprint/ISprint';
import styles from './SprintSider.module.css';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useSprintStore } from '../../../store/sprintStore';
import Swal from 'sweetalert2';
import { deleteSprintController } from '../../../data/sprintController';

interface ISprintSiderProps {
    sprint: ISprint;
    updateSprint: () => void;
    deleteSprint: () => void;
    viewSprint: () => void;
}

export const SprintSider: FC<ISprintSiderProps> = ({
    sprint,
    updateSprint,
    viewSprint,
}) => {

    const handleEditSprint = () => {
        useSprintStore.getState().setActiveSprint(sprint);
        updateSprint();
    };

    const handleDeleteSprint = () => {
        useSprintStore.getState().setActiveSprint(sprint);

        Swal.fire({
            title: "Estás seguro?",
            text: `Este sprint será eliminado: "${sprint.nombre}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const sprintId = sprint._id;
                    useSprintStore.getState().removeSprint(sprintId);
                    await deleteSprintController(sprintId);
                    useSprintStore.getState().clearActiveSprint();
                    Swal.fire("Eliminado", "El sprint fue eliminado correctamente", "success");
                } catch (error) {
                    console.error("Error al eliminar sprint:", error);
                    Swal.fire("Error", "No se pudo eliminar el sprint", "error");
                }
            }
        })
    };

    

    return (
        <div className={styles.sprint_container}>
            <h3 style={{fontSize: '1rem'}}>{sprint.nombre}</h3>
            <div>
                <p style={{fontSize:'1rem', marginLeft: '0.5rem'}}><b>Inicio:</b> {sprint.fechaInicio.slice(0, 10)}</p> 
                <p style={{fontSize:'1rem', marginLeft: '0.5rem'}}><b>Cierre:</b> {sprint.fechaCierre.slice(0, 10)}</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '.2rem'}}>
                <button className={styles.sprint_buttonAction} onClick={viewSprint}><FaEye /></button> 
                <button className={styles.sprint_buttonAction} onClick={() => handleEditSprint()}><FaEdit /></button> 
                <button className={styles.sprint_buttonAction} onClick={() => handleDeleteSprint()}><FaTrash /></button>
            </div>
        </div>
    )
}