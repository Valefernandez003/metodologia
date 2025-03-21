import { useShallow } from "zustand/shallow"
import { tareaStore } from "../store/tareaStore"
import { editarTarea, eliminarTareaPorId, getAllTareas, postNuevaTarea } from "../http/tareas"
import { ITarea } from "../types/ITareas"
import Swal from "sweetalert2"

const useTareas = () => {

    const {
        tareas,
        setArrayTareas, 
        agregarNuevaTarea, 
        editarUnaTarea, 
        eliminarUnaTarea

    } = tareaStore(useShallow((state)=>({

        tareas: state.tareas,
        setArrayTareas: state.setArrayTareas,
        agregarNuevaTarea: state.agregarNuevaTarea,
        editarUnaTarea: state.editarUnaTarea,
        eliminarUnaTarea: state.eliminarUnaTarea
        }
    )))

    const getTareas = async () => {
        const data = await getAllTareas();
        if (data) setArrayTareas(data);
    }

    const crearTarea = async (nuevaTarea: ITarea) => {
        agregarNuevaTarea(nuevaTarea);
        try {
            Swal.fire('Exito', 'Tarea creada correctamente', 'success');
            await postNuevaTarea(nuevaTarea);
        } catch (error) {
            eliminarUnaTarea(nuevaTarea.id!);
            console.log('Algo salio mal al crear la tarea', error);
        }
    }

    const putTareaEditar = async (tareaEditada: ITarea) => {

        const estadoPrevio = tareas.find(tarea => tarea.id === tareaEditada.id);

        editarUnaTarea(tareaEditada);
        try {
            Swal.fire('Exito', 'Tarea editada correctamente', 'success');
            await editarTarea(tareaEditada);
        } catch (error) {
            if (estadoPrevio) editarUnaTarea(estadoPrevio);
            console.log('Algo salio mal al editar la tarea', error);
        }
    }

    const eliminarTarea = async (idTarea: string) => {
        const estadoPrevio = tareas.find(tarea => tarea.id === idTarea);
        const confirm = Swal.fire({
            title: '¿Estas seguro?',
            text: "Esta accion no se puede deshaser!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!(await confirm).isConfirmed) return;
        eliminarUnaTarea(idTarea);
       try {
        Swal.fire('Exito', 'Tarea eliminada correctamente', 'success');
        await eliminarTareaPorId(idTarea);
       } catch (error) {
        if (estadoPrevio) agregarNuevaTarea(estadoPrevio);
        console.log('Algo salio mal al eliminar la tarea', error);
       }
    }

    return {
        tareas,
        getTareas,
        crearTarea,
        putTareaEditar,
        eliminarTarea
    }
}

export default useTareas
