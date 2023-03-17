export const schema = {
    "description": "string",
    "date_time": "date",
    "category": "string",
    "priority": "boolean",
    "student_id": "string"
}

export interface HttpResponseActivity {
    description: string
    date_time: Date
    category: string
    priority: boolean
    student_id: string
}

export interface HttpRequestActivity {
    description: string
    date_time: string
    category: string
    priority: boolean
    student_id: string
}

export interface HttpRequestActivityUpdate {
    id?: number
    description?: string
    date_time?: string
    category?: string
    priority?: boolean
    student_id?: string
}