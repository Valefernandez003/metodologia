import * as yup from 'yup'

export const tareaSprintSchema = yup.object().shape({
    titulo: yup.string().required('El título es requerido').min(5, "Mínimo 5 caracteres"),
    descripcion: yup.string().required('Ingrese una descripción').min(10, "Mínimo 10 caracteres"),
    fechaLimite: yup.string()
        .required('La fecha de cierre es requerida')
        .test(
            'fecha-no-pasada',
            'La fecha límite no puede ser anterior a hoy',
            function (value) {
                if (!value) return false;

                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                const fechaIngresada = new Date(value);
                fechaIngresada.setHours(0, 0, 0, 0);

                return fechaIngresada >= hoy;
            }
        )
})

export type TareaSprintSchema = yup.InferType<typeof tareaSprintSchema>



