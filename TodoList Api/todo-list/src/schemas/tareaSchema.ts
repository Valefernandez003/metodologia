import * as yup from 'yup'

export const tareaSchema = yup.object().shape({
    titulo: yup.string().required('El título es requerido').min(5, "Mínimo 5 caracteres"),
    descripcion: yup.string().required('Ingrese una descripción').min(10, "Mínimo 10 caracteres"),
    fechaLimite: yup.string().required('La fecha de cierre es requerida'),
})

export type TareaSchema = yup.InferType<typeof tareaSchema>
