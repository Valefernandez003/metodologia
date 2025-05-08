import { FC, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { ICreateTarea } from "../../../../types/Tarea/ICreateTarea";
import { addTareaToSprintController, updateTareaInSprintController } from "../../../../data/sprintController";
import { useSprintStore } from "../../../../store/sprintStore";
import styles from "./TareaSprintModal.module.css";
import { tareaSprintSchema } from "../../../../schemas/tareaSprintSchema";

interface Props {
    mode: "create" | "update";
    sprintId: string;
    onClose: () => void;
}

export const TareaSprintModal: FC<Props> = ({ mode, sprintId, onClose }) => {
    const isUpdateMode = mode === "update";
    const { activeTarea, createTareaSprint, updateTareaSprint, clearActiveTarea } = useSprintStore((state) => state);

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaLimite, setFechaLimite] = useState("");
    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isUpdateMode && activeTarea) {
            setTitulo(activeTarea.titulo);
            setDescripcion(activeTarea.descripcion);
            const fechaFormateada = new Date(activeTarea.fechaLimite).toISOString().slice(0, 10);
            setFechaLimite(fechaFormateada);
        }
    }, [activeTarea, isUpdateMode]);

    const validateField = async (
        field: keyof typeof tareaSprintSchema.fields,
        value: any
    ) => {
        const fieldSchema = tareaSprintSchema.fields[field];
        if ("validate" in fieldSchema && typeof fieldSchema.validate === "function") {
            try {
                await fieldSchema.validate(value);
                setErrores((prev) => ({ ...prev, [field]: "" }));
            } catch (err: any) {
                setErrores((prev) => ({ ...prev, [field]: err.message }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const tareaBase: ICreateTarea = {
            titulo,
            descripcion,
            fechaLimite,
            estado: activeTarea?.estado || "pendiente",
        };

        try {
            await tareaSprintSchema.validate(tareaBase, { abortEarly: false });
            setErrores({});

            if (isUpdateMode && activeTarea) {
                const tareaActualizada = {
                    ...tareaBase,
                    _id: activeTarea?._id || ""
                };
                await updateTareaInSprintController(tareaActualizada);
                updateTareaSprint(sprintId, tareaActualizada);
                clearActiveTarea();
                Swal.fire("Éxito", "Tarea actualizada correctamente", "success");
            } else {
                const nueva = await addTareaToSprintController(sprintId, tareaBase);
                if (nueva) {
                    createTareaSprint(nueva, sprintId);
                    Swal.fire("Éxito", "Tarea creada correctamente", "success");
                } else {
                    Swal.fire("Error", "No se pudo crear la tarea", "error");
                    return;
                }
            }

            onClose();
        } catch (err: any) {
            if (err.inner) {
                const nuevosErrores: { [key: string]: string } = {};
                err.inner.forEach((e: any) => {
                    nuevosErrores[e.path] = e.message;
                });
                setErrores(nuevosErrores);
            } else {
                Swal.fire("Error", "Ocurrió un error al guardar la tarea", "error");
            }
        }
    };

    return (
        <div className="overlay">
            <form className={styles.tareaSprintModal_form} onSubmit={handleSubmit}>
                <h3 className={styles.tareaSprintModal_title}>
                    {isUpdateMode ? "Editar tarea en sprint" : "Crear tarea en sprint"}
                </h3>

                <label>Título:</label>
                <input
                    className={styles.tareaSprintModal_input}
                    type="text"
                    value={titulo}
                    onChange={(e) => {
                        setTitulo(e.target.value);
                        validateField("titulo", e.target.value);
                    }}
                />
                {errores.titulo && <div className={styles.tareaSprintModal_error}>{errores.titulo}</div>}

                <label>Descripción:</label>
                <input
                    className={styles.tareaSprintModal_input}
                    value={descripcion}
                    onChange={(e) => {
                        setDescripcion(e.target.value);
                        validateField("descripcion", e.target.value);
                    }}
                />
                {errores.descripcion && <div className={styles.tareaSprintModal_error}>{errores.descripcion}</div>}

                <label>Fecha Límite:</label>
                <input
                    className={styles.tareaSprintModal_input}
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => {
                        setFechaLimite(e.target.value);
                        validateField("fechaLimite", e.target.value);
                    }}
                />
                {errores.fechaLimite && <div className={styles.tareaSprintModal_error}>{errores.fechaLimite}</div>}

                <Stack direction="row" spacing={20} className={styles.tareaSprintModal_containerButtons}>
                    <Button
                        type="button"
                        variant="contained"
                        color="error"
                        sx={{ width: "10rem", height: "2rem", borderRadius: "5px" }}
                        onClick={onClose}
                    >
                        Cerrar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        sx={{ width: "10rem", height: "2rem", borderRadius: "5px" }}
                    >
                        {isUpdateMode ? "Aceptar" : "Crear"}
                    </Button>
                </Stack>
            </form>
        </div>
    );
};
