export const schema = {
    "name": "string",
    "active": "boolean",
    "email": "string",
    "notes": "string"
}

export interface HttpResponseStudent {
    name: string
    active: boolean
    email: string
    notes: string
}

export interface HttpRequestStudentCreateJson {
    name: string
    active: string
    email: string
    notes: string
}

export interface HttpRequestStudentUpdateJson {
    id?: number
    name?: string
    active?: string
    email?: string
    notes?: string
}