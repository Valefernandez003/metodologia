import { FC, useEffect, useState } from 'react'
import { tareaStore } from '../../../store/tareaStore'
import styles from './Modal.module.css'
import { ITarea } from '../../../types/ITareas'
import useTareas from '../../../hooks/useTareas'

type IModal = {
    handleCloseModal: VoidFunction
}

const initialState: ITarea = {
    titulo: '',
    descripcion: '',
    fechaLimite: ''
}

export const Modal: FC<IModal> = ({handleCloseModal}) => {

    const tareaActiva = tareaStore((state) => state.tareaActiva)
    const setTareaActiva = tareaStore((state) => state.setTareaActiva)

    const {crearTarea, putTareaEditar} = useTareas();

    const [formValues, setFormValues] = useState<ITarea>(initialState)

    useEffect(()=>{
        if(tareaActiva) setFormValues(tareaActiva)
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormValues((prev)=>({...prev, [`${name}`]: value}))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (tareaActiva) {
           await putTareaEditar(formValues);
        } else {
            await crearTarea({...formValues, id: new Date().toDateString()});
        }
        setTareaActiva(null);
        handleCloseModal();
    }

    return (
        <div className={styles.containerPrincipalModal}>
            <div className={styles.contentPopUp}>
                <div>
                    <h3>{tareaActiva ? "Editar tarea" : "Crear tarea"}</h3>
                </div>
                <form onSubmit={handleSubmit} className={styles.formContent}>
                    <div>
                        <input
                            type="text"
                            placeholder='Ingrese un titulo' 
                            required 
                            onChange={handleChange}
                            autoComplete='off' 
                            name='titulo'
                            value={formValues.titulo}
                        />
                        <textarea 
                            placeholder='Ingrese una descripcion' 
                            required 
                            onChange={handleChange}
                            name='descripcion' 
                            value={formValues.descripcion}
                        />
                        <input 
                            type="date" 
                            required 
                            onChange={handleChange}
                            autoComplete='off' 
                            name='fechaLimite'
                            value={formValues.fechaLimite}
                        />
                    </div>
                    <div className={styles.buttonCard}>
                        <button onClick={handleCloseModal}>Cancelar</button>
                        <button type="submit">{tareaActiva ? "Editar tarea" : "Crear tarea"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}