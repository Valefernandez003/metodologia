
export const getCursos = async () => {
    const res = await fetch("http://localhost:3000/cursos");
    return await res.json();
}

export const getCursoPorId = async (idCurso: string) => {
    const res = await fetch(`http://localhost:3000/cursos/${idCurso}`);
    return await res.json(); 
};