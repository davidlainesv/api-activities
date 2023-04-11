/**
 * Tipos de dato de las columnas de la tabla de Actividades dentro de la base de datos
 */
export const schema = {
    "description": "string",
    "date_time": "string",
    "category": "string",
    "priority": "boolean",
    "student_id": "string"
}

/**
 * Estructura de una actividad devuelta por la API
 */
export interface HttpResponseActivity {
    activity_id: number
    description: string
    date_time: Date
    category: string
    priority: boolean
    student_id: string
}

/**
 * Estructura de una actividad recibida en la API
 */
export interface HttpRequestActivity {
    description: string
    date_time: string
    category: string
    priority: boolean
    student_id: string
}

/**
 * Estructura de un objeto de actualización de actividad recibido en la API
 */
export interface HttpRequestActivityUpdate {
    id?: number
    description?: string
    date_time?: string
    category?: string
    priority?: boolean
    student_id?: string
}