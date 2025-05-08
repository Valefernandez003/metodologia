import { create } from "zustand";
import { ISprintState } from "../types/Sprint/IStore/ISprintState";

export const useSprintStore = create<ISprintState>((set) => ({
    sprints: [],
    activeSprint: null,
    activeTarea: null,

    setActiveSprint: (sprint) => set({ activeSprint: sprint }),
    clearActiveSprint: () => set({ activeSprint: null }),

    setActiveTarea: (tarea) => set({ activeTarea: tarea }),
    clearActiveTarea: () => set({ activeTarea: null }),

    createSprint: (sprint) => {
        set((state) => ({
        sprints: [...state.sprints, sprint],
        }));
    },

    removeSprint: (sprintID) => {
        set((state) => ({
        sprints: state.sprints.filter((spr) => spr._id !== sprintID),
        }));
    },

    updateSprint: (sprint) => {
        set((state) => ({
        sprints: state.sprints.map((spr) =>
            spr._id === sprint._id ? sprint : spr
        ),
        }));
    },

    createTareaSprint: (tarea, sprintID) => {
        set((state) => ({
        sprints: state.sprints.map((spr) =>
            spr._id === sprintID
            ? { ...spr, tareas: [...spr.tareas, tarea] }
            : spr
        ),
        }));
    },

    updateTareaSprint: (sprintID, tareaActualizada) => {
        set((state) => ({
        sprints: state.sprints.map((spr) =>
            spr._id === sprintID
            ? {
                ...spr,
                tareas: spr.tareas.map((t) =>
                    t._id === tareaActualizada._id ? { ...t, ...tareaActualizada } : t
                ),
                }
            : spr
        ),
        }));
    },

    removeTareaSprint: (sprintID, tareaID) => {
        set((state) => ({
        sprints: state.sprints.map((spr) =>
            spr._id === sprintID
            ? {
                ...spr,
                tareas: spr.tareas.filter((t) => t._id !== tareaID),
                }
            : spr
        ),
        }));
    },
}));
