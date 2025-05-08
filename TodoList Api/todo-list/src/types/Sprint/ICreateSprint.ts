import { ITarea } from "../Tarea/ITarea";

export interface ICreateSprint {
    fechaInicio: string;
    fechaCierre: string;
    nombre: string;
    tareas: ITarea[];
}