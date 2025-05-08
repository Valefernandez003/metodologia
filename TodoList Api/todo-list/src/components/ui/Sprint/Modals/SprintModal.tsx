import { FC, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Stack, Button } from "@mui/material";
import { ICreateSprint } from "../../../../types/Sprint/ICreateSprint";
import { addSprintController, updateSprintController } from "../../../../data/sprintController";
import { useSprintStore } from "../../../../store/sprintStore";
import styles from "./SprintModal.module.css";
import { sprintSchema } from "../../../../schemas/sprintSchema";

interface SprintModalProps {
    onClose: () => void;
    initialValues?: ICreateSprint & { id?: string; _id?: string };
    mode: "create" | "update";
}

export const SprintModal: FC<SprintModalProps> = ({ onClose, initialValues, mode }) => {
    const isUpdateMode = mode === "update";
    const { createSprint, updateSprint } = useSprintStore((state) => state);

    const [nombre, setNombre] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaCierre, setFechaCierre] = useState("");
    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isUpdateMode && initialValues) {
            setNombre(initialValues.nombre);
            setFechaInicio(new Date(initialValues.fechaInicio).toISOString().slice(0, 10));
            setFechaCierre(new Date(initialValues.fechaCierre).toISOString().slice(0, 10));
        }
    }, [initialValues, isUpdateMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sprintBase: ICreateSprint = {
            nombre,
            fechaInicio,
            fechaCierre,
            tareas: initialValues?.tareas || [],
        };

        try {
            await sprintSchema.validate(sprintBase, { abortEarly: false });
            setErrores({});

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const inicio = new Date(fechaInicio);
            const cierre = new Date(fechaCierre);

            if (inicio < hoy) {
                setErrores((prev) => ({ ...prev, fechaInicio: "La fecha de inicio no puede ser anterior a hoy" }));
                return;
            }

            if (cierre < hoy) {
                setErrores((prev) => ({ ...prev, fechaCierre: "La fecha de cierre no puede ser anterior a hoy" }));
                return;
            }

            if (cierre < inicio) {
                setErrores((prev) => ({ ...prev, fechaCierre: "La fecha de cierre no puede ser anterior a la de inicio" }));
                return;
            }

            if (isUpdateMode) {
                const sprintActualizado = {
                    ...sprintBase,
                    _id: (initialValues as any)._id || initialValues?.id || ""
                };
                const actualizado = await updateSprintController(sprintActualizado);
                updateSprint(actualizado);
                Swal.fire("Éxito", "Sprint actualizado correctamente", "success");
            } else {
                const creado = await addSprintController(sprintBase);
                if (creado) {
                    createSprint(creado);
                    Swal.fire("Éxito", "Sprint creado correctamente", "success");
                } else {
                    Swal.fire("Error", "No se pudo crear el sprint", "error");
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
                Swal.fire("Error", "Ocurrió un error al guardar el sprint", "error");
            }
        }
    };

    return (
        <div className="overlay">
            <form className={styles.sprintModal_form} onSubmit={handleSubmit}>
                <h3 className={styles.sprintModal_title}>
                    {isUpdateMode ? "Editar Sprint" : "Crear Sprint"}
                </h3>

                <label>Nombre:</label>
                <input
                    className={styles.sprintModal_input}
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                {errores.nombre && <div className={styles.sprintModal_error}>{errores.nombre}</div>}

                <label>Fecha de Inicio:</label>
                <input
                    className={styles.sprintModal_input}
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                />
                {errores.fechaInicio && <div className={styles.sprintModal_error}>{errores.fechaInicio}</div>}

                <label>Fecha de Cierre:</label>
                <input
                    className={styles.sprintModal_input}
                    type="date"
                    value={fechaCierre}
                    onChange={(e) => setFechaCierre(e.target.value)}
                />
                {errores.fechaCierre && <div className={styles.sprintModal_error}>{errores.fechaCierre}</div>}

                <Stack direction="row" spacing={20} className={styles.sprintModal_containerButtons}>
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
                        {isUpdateMode ? "Actualizar" : "Crear"}
                    </Button>
                </Stack>
            </form>
        </div>
    );
};
