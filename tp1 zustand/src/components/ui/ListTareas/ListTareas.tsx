import styles from './ListTareas.module.css'
import { useEffect, useState } from 'react'
import { tareaStore } from '../../../store/tareaStore'
import CardList from '../CardList/CardList'
import {Modal} from '../Modal/Modal'
import { ITarea } from '../../../types/ITareas'
import useTareas from '../../../hooks/useTareas'

const ListTareas = () => {

    const setTareaActiva = tareaStore((state) => state.setTareaActiva)

    const {tareas, getTareas} = useTareas();

    useEffect(() => {
        getTareas();
    }, [])

    const [openModalTarea, setOpenModalTarea] = useState(false)

    const handleOpenModalEdit = (tarea: ITarea) => {
        setTareaActiva(tarea);
        setOpenModalTarea(true);
    }

    const handleCloseModal = () => {
        setOpenModalTarea(false);
    }

    return (
        <>
            <div className={styles.containerPrincipalListTareas}>
                <div className={styles.containerTitleAndButton}>
                    <h2>Lista de Tareas</h2>
                    <button onClick={() => setOpenModalTarea(true)}>Agregar tarea</button>
                </div>

                <div className={styles.containerList}>
                    {
                        tareas.length > 0 ?
                        tareas.map((el)=>(
                            <CardList 
                                handleOpenModalEdit={handleOpenModalEdit}
                                tarea={el}
                            />
                        )) : 
                        <div>
                            <h3>No hay tareas</h3>
                        </div>
                    }
                </div>
            </div>
            {openModalTarea && <Modal handleCloseModal={handleCloseModal} />}
        </>
    )
}

export default ListTareas
