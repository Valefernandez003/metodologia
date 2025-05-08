import axios from "axios";
import { API_URL } from "../utils/constantes";
import { ISprint } from "../types/Sprint/ISprint";
import { ICreateSprint } from "../types/Sprint/ICreateSprint";
import { ITarea } from "../types/Tarea/ITarea";
import { ICreateTarea } from "../types/Tarea/ICreateTarea";

export const getSprintListController = async (): Promise<ISprint[]> => {
    const response = await axios.get<ISprint[]>(`${API_URL}/sprints`);
    return response.data;
};

export const addSprintController = async (nuevoSprint: ICreateSprint) => {
    const response = await axios.post(`${API_URL}/sprints`, nuevoSprint);
    return response.data;
};

export const updateSprintController = async (sprintActualizado: ISprint) => {
    const { _id, ...data } = sprintActualizado;
    const response = await axios.put(`${API_URL}/sprints/${_id}`, data);
    return response.data;
};

export const deleteSprintController = async (idSprint: string) => {
    await axios.delete(`${API_URL}/sprints/${idSprint}`);
};

export const addTareaToSprintController = async (idSprint: string, tarea: ICreateTarea) => {
    const response = await axios.post(`${API_URL}/tasks`, tarea);
    const nuevaTarea = response.data;

    await axios.put(`${API_URL}/sprints/${idSprint}/add-task/${nuevaTarea._id}`);

    return nuevaTarea;
};

export const updateTareaInSprintController = async (tareaActualizada: ITarea) => {
    const { _id, ...data } = tareaActualizada;
    await axios.put(`${API_URL}/tasks/${_id}`, data);
};



export const deleteTareaFromSprintController = async (idTarea: string) => {
    try {
        await axios.delete(`${API_URL}/tasks/${idTarea}`);
    } catch (error) {
        console.error("Error en deleteTareaBacklogController", error);
        throw error;
    }
};