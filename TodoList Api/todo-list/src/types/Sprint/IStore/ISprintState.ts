import { ITarea } from "../../Tarea/ITarea";
import { ISprint } from "../ISprint";

export interface ISprintState {
    sprints: ISprint[];
    activeSprint: ISprint | null;
    activeTarea: ITarea | null;

    setActiveSprint: (sprint: ISprint) => void;
    clearActiveSprint: () => void;

    setActiveTarea: (tarea: ITarea) => void;
    clearActiveTarea: () => void; 

    createSprint: (sprint: ISprint) => void;
    removeSprint: (sprintID: string) => void; 
    updateSprint: (sprint: ISprint) => void;

    createTareaSprint: (tarea: ITarea, sprintID: string) => void; 
    updateTareaSprint: (sprintID: string, tareaActualizada: ITarea) => void;
    removeTareaSprint: (sprintID: string, tareaID: string) => void;
}

