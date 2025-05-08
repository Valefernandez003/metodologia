import { FC, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { ICreateTarea } from "../../../../types/Tarea/ICreateTarea";
import { addTareaBacklogController, updateTareaBacklogController } from "../../../../data/backlogController";
import { useBacklogStore } from "../../../../store/backlogStore";
import styles from "./TareaModal.module.css";
import { tareaSchema } from "../../../../schemas/tareaSchema";

interface TareaModalProps {
    mode: "create" | "update";
    initialValues?: ICreateTarea & { id?: string };
    onClose: () => void;
}

export const TareaModal: FC<TareaModalProps> = ({
    mode,
    initialValues,
    onClose,
}) => {
    const isUpdateMode = mode === "update";

    const { createTarea, updateTarea, clearActiveTarea } = useBacklogStore(
        (state) => state
    );

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaLimite, setFechaLimite] = useState("");
    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isUpdateMode && initialValues) {
            setTitulo(initialValues.titulo);
            setDescripcion(initialValues.descripcion);
            const fechaFormateada = new Date(initialValues.fechaLimite).toISOString().split("T")[0];
            setFechaLimite(fechaFormateada);
        }
    }, [initialValues, isUpdateMode]);

    const validateField = async (field: keyof typeof tareaSchema.fields, value: any) => {
        const fieldSchema = tareaSchema.fields[field];
        if ('validate' in fieldSchema && typeof fieldSchema.validate === 'function') {
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
            estado: initialValues?.estado || "pendiente"
        };

        try {
            await tareaSchema.validate(tareaBase, { abortEarly: false });
            setErrores({});

            if (isUpdateMode) {
                const tareaActualizada = { ...tareaBase, _id: (initialValues as any)._id || initialValues?.id || ""};
                const result = await updateTareaBacklogController(tareaActualizada);
                updateTarea(result);
                clearActiveTarea();
                Swal.fire("Éxito", "Tarea actualizada correctamente", "success");
            } else {
                const tareaCreada = await addTareaBacklogController(tareaBase);
                if (tareaCreada) {
                    createTarea(tareaCreada);
                    Swal.fire("Éxito", "Tarea creada correctamente", "success");
                } else {
                    Swal.fire("Error", "No se pudo crear la tarea", "error");
                    return;
                }
            }

            onClose();
        } catch (err: any) {
            if (err.inner) {
                const nuevoErrores: { [key: string]: string } = {};
                err.inner.forEach((e: any) => {
                    nuevoErrores[e.path] = e.message;
                });
                setErrores(nuevoErrores);
            } else {
                Swal.fire("Error", "Ocurrió un error al guardar la tarea", "error");
            }
        }
    };

    return (
        <div className="overlay">
            <form className={styles.tareaModal_form} onSubmit={handleSubmit}>
                <h3 className={styles.tareaModal_tittle}>
                    {isUpdateMode ? "Editar tarea" : "Crear tarea"}
                </h3>

                <label>Título:</label>
                <input
                    className={styles.tareaModal_input}
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => {
                        setTitulo(e.target.value);
                        validateField("titulo", e.target.value);
                    }}
                />
                {errores.titulo && <div className={styles.error}>{errores.titulo}</div>}

                <label>Descripción:</label>
                <input
                    className={styles.tareaModal_input}
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => {
                        setDescripcion(e.target.value);
                        validateField("descripcion", e.target.value);
                    }}
                />
                {errores.descripcion && <div className={styles.error}>{errores.descripcion}</div>}

                <label>Fecha Límite:</label>
                <input
                    className={styles.tareaModal_input}
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => {
                        setFechaLimite(e.target.value);
                        validateField("fechaLimite", e.target.value);
                    }}
                />
                {errores.fechaLimite && <div className={styles.error}>{errores.fechaLimite}</div>}

                <Stack
                    direction="row"
                    spacing={20}
                    className={styles.tareaModal_containerButtons}
                >
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
