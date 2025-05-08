import axios from "axios";
import { ITarea } from "../types/Tarea/ITarea";
import { ICreateTarea } from "../types/Tarea/ICreateTarea";
import { API_URL } from "../utils/constantes";

export const getBacklogController = async (): Promise<ITarea[]> => {
    const response = await axios.get<{ tareas: ITarea[] }>(`${API_URL}/backlog`);
    return response.data.tareas;
};

export const addTareaBacklogController = async (nuevaTarea: ICreateTarea) => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, nuevaTarea);
        const nuevaTareaConId = response.data;

        await axios.put(`${API_URL}/backlog/add-task/${nuevaTareaConId._id}`);

        return nuevaTareaConId;
    } catch (error) {
        console.error("Error en addTareaBacklogController", error);
        throw error;
    }
};

export const updateTareaBacklogController = async (tareaActualizada: ITarea) => {
    try {
        const { _id, ...data } = tareaActualizada;
        await axios.put(`${API_URL}/tasks/${_id}`, data);
        return tareaActualizada;
    } catch (error) {
        console.error("Error en updateTareaBacklogController", error);
        throw error;
    }
};

export const deleteTareaBacklogController = async (idTarea: string) => {
    try {
        await axios.delete(`${API_URL}/tasks/${idTarea}`);
    } catch (error) {
        console.error("Error en deleteTareaBacklogController", error);
        throw error;
    }
};
