import { cast_item, cast_items, generate_sql_update_entries } from "../../common/utils"
import { sendSql } from "../../db/pool"
import { HttpRequestActivity, HttpRequestActivityUpdate, schema } from "./model"
import { HttpResponseActivity } from "./model"

/**
 * Actualiza una actividad en la base de datos
 * @param activity_id string con el id de la actividad
 * @param update objeto que agrupa las propiedades que se van a actualizar
 * @returns actividad completa actualizada
 */
export async function update_activity(activity_id: string, update: HttpRequestActivityUpdate): Promise<HttpResponseActivity> {
    const sql_update_entries = generate_sql_update_entries(schema, update)
    const sql = `
        UPDATE activities SET 
        ${sql_update_entries}
        WHERE activity_id=${activity_id}
    `
    try {
        const result = await sendSql(sql)
        return cast_item<HttpResponseActivity>(schema, result)
    } catch (error) {
        throw Error(error as string)
    }
}

/**
 * Obtiene una actividad de la base de datos
 * @param activity_id string con el id de la actividad
 * @returns actividad devuelta por la base de datos
 */
export async function select_activity(activity_id: string): Promise<HttpResponseActivity> {
    const sql = `SELECT * FROM activities WHERE activity_id=${activity_id}`
    console.log(sql)
    try {
        const results = await sendSql(sql)
        return cast_item<HttpResponseActivity>(schema, results[0])
    } catch (error) {
        throw Error(error as string)
    }
}

/**
 * Obtiene la lista completa de actividades de la base de datos
 * @returns lista de actividades devuelto por la base de datos
 */
export async function select_activities(): Promise<HttpResponseActivity[]> {
    const sql = "SELECT * FROM activities"
    try {
        const results = await sendSql(sql)
        return cast_items<HttpResponseActivity>(schema, results)
    } catch (error) {
        throw Error(error as string)
    }
}

/**
 * Inserta una actividad en la base de datos
 * @param activity actividad que se quiere agregar a la base de datos
 * @returns devuelve la actividad insertada (con ID)
 */
export async function insert_activity(activity: HttpRequestActivity) {
    const priority_bit = + activity.priority
    const sql = `
        INSERT INTO activities (description, date_time, category, priority, student_id)
        VALUES ('${activity.description}', '${activity.date_time}', '${activity.category}', ${priority_bit}, '${activity.student_id}')
    `;
    try {
        const result = await sendSql(sql)
        return cast_item<HttpResponseActivity>(schema, result)
    } catch (error) {
        throw Error(error as string)
    }
}

/**
 * Elimina una actividad de la base de datos
 * @param activity_id string con el id de la actividad
 * @returns devuelve el id de la actividad eliminada
 */
export async function delete_activity(activity_id: string) {
    var sql = `
        DELETE FROM activities WHERE activity_id = ${activity_id}
    `;

    try {
        await sendSql(sql)
        return activity_id
    } catch (error) {
        throw Error(error as string)
    }
}
