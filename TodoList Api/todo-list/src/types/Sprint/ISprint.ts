import { ITarea } from "../Tarea/ITarea";

export interface ISprint {
    _id: string;
    nombre: string;
    fechaInicio: string;
    fechaCierre: string;
    tareas: ITarea[];
}

