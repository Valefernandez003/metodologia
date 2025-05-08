import { ITarea } from "../ITarea";

export interface IBacklogState {
    tareas: ITarea[];
    activeTarea: ITarea | null;

    setActiveTarea: (tarea: ITarea) => void;
    clearActiveTarea: () => void;

    createTarea: (tarea: ITarea) => void;
    updateTarea: (tarea: ITarea) => void;
    removeTarea: (_id: string) => void; 
}
