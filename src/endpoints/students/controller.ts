import { generate_sql_update_entries } from "../../common/utils"
import { sendSql } from "../../db/pool"
import { HttpRequestStudentCreateJson, HttpRequestStudentUpdateJson, schema } from "./model"
import { HttpResponseStudent } from "./model"

export function cast_item(item: any): HttpResponseStudent {
    return {
        ...item,
        active: Boolean(item.active)
    }
}

export function cast_items(items: any[]): HttpResponseStudent[] {
    return items.map(item => {
        return cast_item(item)
    })
}

export async function update_item(student_id: number, update: HttpRequestStudentUpdateJson) {
    const sql_update_entries = generate_sql_update_entries(schema, update)
    const sql = `
        UPDATE students SET 
        ${sql_update_entries}
        WHERE student_id=${student_id}
    `
    try {
        const result = await sendSql(sql)
        return cast_item(result)
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}

export async function select_item(student_id: number) {
    const sql = `SELECT * FROM students WHERE student_id=${student_id}`
    try {
        const results = await sendSql(sql)
        return cast_item(results[0])
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}

export async function select_items() {
    const sql = "SELECT * FROM students"
    try {
        const results = await sendSql(sql)
        return cast_item(results[0])
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}

export async function insert_item(student: HttpRequestStudentCreateJson) {
    const active_bit = + student.active
    const sql = `
        INSERT INTO students (name, active, email, notes)
        VALUES ('${student.name}', ${active_bit}, '${student.email}', '${student.notes}')
    `;
    try {
        const results = await sendSql(sql)
        return cast_item(results)
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}

export async function delete_item(student_id: number) {
    const sql = `DELETE FROM students WHERE student_id=${student_id}`
    try {
        await sendSql(sql)
        return student_id
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}