import * as yup from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const sprintSchema = yup.object({
    nombre: yup
        .string()
        .required("El nombre es obligatorio")
        .min(5, "El nombre debe tener al menos 5 caracteres")
        .max(100, "El nombre no puede superar los 100 caracteres"),

    fechaInicio: yup
        .date()
        .typeError("Fecha de inicio inválida")
        .required("La fecha de inicio es obligatoria")
        .min(today, "La fecha de inicio no puede ser anterior a hoy"),

    fechaCierre: yup
        .date()
        .typeError("Fecha de cierre inválida")
        .required("La fecha de cierre es obligatoria")
        .min(today, "La fecha de cierre no puede ser anterior a hoy")
        .min(yup.ref("fechaInicio"), "La fecha de cierre no puede ser anterior a la fecha de inicio"),
});

export type SprintSchema = yup.InferType<typeof sprintSchema>;
