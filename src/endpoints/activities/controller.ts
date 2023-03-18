import { generate_sql_update_entries } from "../../common/utils"
import { sendSql } from "../../db/pool"
import { HttpRequestActivity, HttpRequestActivityUpdate, schema } from "./model"
import { HttpResponseActivity } from "./model"

export function cast_activity(item: any): HttpResponseActivity {
    return {
        ...item,
        priority: Boolean(item.priority)
    }
}

export function cast_activities(items: any[]): HttpResponseActivity[] {
    return items.map(item => {
        return cast_activity(item)
    })
}

export async function update_activity(activity_id: string, update: HttpRequestActivityUpdate) {
    const sql_update_entries = generate_sql_update_entries(schema, update)
    const sql = `
        UPDATE activities SET 
        ${sql_update_entries}
        WHERE activity_id=${activity_id}
    `
    try {
        const result = await sendSql(sql)
        return cast_activity(result)
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}

export async function select_activity(activity_id: string) {
    const sql = `SELECT * FROM activities WHERE activity_id=${activity_id}`
    try {
        const results = await sendSql(sql)
        return cast_activity(results[0])
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}

export async function select_activities() {
    const sql = "SELECT * FROM activities"
    try {
        const results = await sendSql(sql)
        return cast_activities(results)
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}

export async function insert_activity(activity: HttpRequestActivity) {
    const priority_bit = + activity.priority
    const sql = `
        INSERT INTO activities (description, date_time, category, priority, student_id)
        VALUES ('${activity.description}', '${activity.date_time}', '${activity.category}', ${priority_bit}, '${activity.student_id}')
    `;
    try {
        const results = await sendSql(sql)
        return cast_activity(results)
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}

export async function delete_activity(activity_id: string) {
    var sql = `
        DELETE FROM activities WHERE activity_id = ${activity_id}
    `;

    try {
        await sendSql(sql)
        return activity_id
    } catch (error) {
        return {
            "message": "Error de servidor",
            "server_message": error
        }
    }
}
