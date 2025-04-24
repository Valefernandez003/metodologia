import { object, string, ref } from "yup";

export const schemaUser  = object({
  name: string()
  .required('Name is required')
  .min(6, 'el nombre debe tener al menos 6 caracteres.'),
  email: string()
  .required('Email is required')
  .email('el formato no es correcto'),
  password: string()
  .required('Password is required')
  .min(8, 'la contraseña debe tener al menos 8 caracteres'),
  confirmPassword: string()
  .required('Confirm password is required')
  .oneOf([ref('password')], "las contraseñas no coinciden"),
});