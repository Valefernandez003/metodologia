import { useEffect, useState } from 'react';
import { useBacklogStore } from '../../../store/backlogStore';
import { getBacklogController } from '../../../data/backlogController';
import { FaPlus } from 'react-icons/fa';
import { TareasBacklog } from './TareasBacklog';
import { ViewTarea } from './Modals/ViewTarea/ViewTarea';
import styles from './Backlog.module.css';
import { ITarea } from '../../../types/Tarea/ITarea';
import { TareaModal } from './Modals/TareaModal';

export const Backlog = () => {
    const tareas = useBacklogStore((state) => state.tareas);
    const [showTareaModal, setShowTareaModal] = useState(false);
    const [activeTarea, setActiveTarea] = useState<ITarea | null>(null);
    const [modalMode, setModalMode] = useState<"create" | "update">("create");
    const [showViewTarea, setShowViewTarea] = useState(false);

    useEffect(() => {
        const fetchDataBacklog = async () => {
            try {
                const response = await getBacklogController();
                useBacklogStore.setState({ tareas: response });
            } catch (error) {
                console.error("Error cargando las tareas: ", error);
            }
        };
        fetchDataBacklog();
    }, []);
    
    const handleCreateClick = () => {
        setActiveTarea(null);
        setModalMode("create");
        setShowTareaModal(true);
    };

    const handleEditClick = (tarea: ITarea) => {
        setActiveTarea(tarea);
        setModalMode("update");
        setShowTareaModal(true);
    };

    return (
        <>
        <div>
            <h1 style={{ fontSize: "2rem" }}>Backlog</h1>
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <h3 style={{ display: "flex", gap: "2rem", alignItems: "center" }}>Tareas en el Backlog</h3>
            <button className={styles.backlog_tareaButtonAdd} onClick={handleCreateClick}>
                Crear Tarea <FaPlus />
            </button>
        </div>
        {tareas && tareas.length > 0 ? (
            tareas.map((tra) => (
                <TareasBacklog
                    key={tra._id}
                    tarea={tra}
                    updateTarea={() => handleEditClick(tra)}
                    deleteTarea={() => {}} 
                    viewTarea={() => setShowViewTarea(true)}
                />
            ))

        ) : (

            <p className={styles.backlog_tareaNoTareas}>No hay tareas en el backlog</p>

        )}

        {showTareaModal && <TareaModal mode={modalMode} initialValues={activeTarea || undefined} onClose={() => setShowTareaModal(false)} />}
        {showViewTarea && <ViewTarea onClose={() => setShowViewTarea(false)} />}
        </>
    );
};
