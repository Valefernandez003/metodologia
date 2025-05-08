import { FaPlus } from 'react-icons/fa';
import styles from './Home.module.css';
import { useSprintStore } from '../../store/sprintStore';
import { SprintSider } from '../ui/Sprint/SprintSider';
import { useEffect, useState, FC } from 'react';
import { getSprintListController } from '../../data/sprintController';
import { SprintModal } from '../ui/Sprint/Modals/SprintModal';  // Asegúrate de importar el modal unificado
import { TareasSprint } from '../ui/TareaSprint/TareaSprint';
import { Backlog } from '../ui/Backlog/Backlog';
import { useNavigate, useParams } from 'react-router-dom';

interface HomeProps {
    vista: "backlog" | "sprint";
}

export const Home: FC<HomeProps> = ({ vista }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const sprints = useSprintStore((state) => state.sprints);

    const [showSprintModal, setShowSprintModal] = useState(false);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [initialValues, setInitialValues] = useState<any>(null);

    useEffect(() => {
        const fetchDataSprints = async () => {
            try {
                const response = await getSprintListController();
                useSprintStore.setState({ sprints: response });
            } catch (error) {
                console.error("Error cargando los sprints: ", error);
            }
        };

        fetchDataSprints();
    }, []);

    useEffect(() => {
        if (vista === "sprint" && id) {
            const sprint = sprints.find((s) => s._id === id);
            if (sprint) {
                useSprintStore.getState().setActiveSprint(sprint);
                setInitialValues(sprint);
                setMode("update");
            }
        } else {
            useSprintStore.getState().clearActiveSprint();
            setMode("create");
            setInitialValues(null);
        }
    }, [vista, id, sprints]);

    return (
        <div className={styles.home_container}>
            <div className={styles.home_header}>
                <h1 className={styles.home_headerTittle}>Administración de Tareas</h1>
            </div>

            <div className={styles.home_content}>
                <div className={styles.home_contentSider}>
                    <button className={styles.home_siderButton} onClick={() => navigate("/backlog")}>Backlog</button>
                    <div className={styles.home_siderTareasContainer}>
                        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                            <h3 style={{ fontSize: "1.5rem" }}>Lista Sprints</h3>
                            <button className={styles.home_siderButtonAdd} onClick={() => setShowSprintModal(true)}>
                                <FaPlus />
                            </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {sprints && sprints.length > 0 ? (
                                sprints.map((spr) => (
                                    <SprintSider
                                        key={spr._id}
                                        sprint={spr}
                                        updateSprint={() => {
                                            setInitialValues(spr);
                                            setMode("update");
                                            setShowSprintModal(true);
                                        }}
                                        deleteSprint={() => {}}
                                        viewSprint={() => navigate(`/sprint/${spr._id}`)}
                                    />
                                ))
                            ) : (
                                <p className={styles.home_siderNoSprints}>No hay sprints</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.home_contentVistas}>
                    {vista === "backlog" ? <Backlog /> : <TareasSprint />}
                </div>
            </div>

            {showSprintModal && (
                <SprintModal
                    mode={mode}
                    onClose={() => setShowSprintModal(false)}
                    initialValues={initialValues}
                />
            )}
        </div>
    );
};

