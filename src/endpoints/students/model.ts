/**
 * Tipos de dato de las columnas de la tabla de Estudiantes dentro de la base de datos
 */
export const schema = {
    "name": "string",
    "active": "boolean",
    "email": "string",
    "notes": "string",
    "picture": "image",
    "picture_name": "string",
    "picture_type": "string"
}

/**
 * Estructura de un estudiante devuelto por la API
 */
export interface HttpResponseStudent {
    student_id: string
    name: string
    active: boolean
    email: string
    notes: string
    picture: string
    picture_name: string
    picture_type: string
}

/**
 * Estructura de un estudiante recibido en la API
 */
export interface HttpRequestStudentCreateJson {
    student_id: string
    name: string
    active: string
    email: string
    notes: string
}

/**
 * Estructura de un objeto de actualización de estudiante recibido en la API
 */
export interface HttpRequestStudentUpdateJson {
    id?: number
    name?: string
    active?: string
    email?: string
    notes?: string
}