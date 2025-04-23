export interface Estudiante {
    id: number;
    nombre: string;
    edad: number;
}


export interface Curso {
    id: number;
    nombre: string;
    estudiantes: Estudiante[];
}