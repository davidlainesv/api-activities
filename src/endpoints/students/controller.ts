import { cast_item, cast_items, generate_sql_update_entries } from "../../common/utils"
import { sendSql } from "../../db/pool"
import { HttpRequestStudentCreateJson, HttpRequestStudentUpdateJson, HttpResponseStudent, schema } from "./model"


export async function insert_picture(student_id: string, _imageName: string, _imageType: string, imageData: Buffer) {
    const sql = `
        UPDATE students SET
        picture_name=?,
        picture_type=?,
        picture=?
        WHERE student_id='${student_id}'
    `
    try {
        await sendSql(sql, [_imageName, _imageType, imageData])
        return select_item(student_id)
    } catch (error) {
        throw Error(error as string)
    }
}


export async function update_item(student_id: string, update: HttpRequestStudentUpdateJson) {
    const sql_update_entries = generate_sql_update_entries(schema, update)
    const sql = `
        UPDATE students SET 
        ${sql_update_entries}
        WHERE student_id='${student_id}'
    `
    try {
        await sendSql(sql)
        return select_item(student_id)
    } catch (error) {
        throw Error(error as string)
    }
}

export async function select_item(student_id: string) {
    const sql = `SELECT * FROM students WHERE student_id='${student_id}'`
    try {
        const results = await sendSql(sql)
        return cast_item<HttpResponseStudent>(schema, results[0])
    } catch (error) {
        throw Error(error as string)
    }
}

export async function select_items() {
    const sql = "SELECT * FROM students"
    try {
        const results = await sendSql(sql)
        return cast_items<HttpResponseStudent>(schema, results)
    } catch (error) {
        throw Error(error as string)
    }
}

export async function insert_item(student: HttpRequestStudentCreateJson) {
    const active_bit = + student.active
    const sql = `
        INSERT INTO students (student_id, name, active, email, notes)
        VALUES ('${student.student_id}', '${student.name}', ${active_bit}, '${student.email}', '${student.notes}')
    `;
    try {
        await sendSql(sql) // => ResultSetHeader
        return select_item(student.student_id)
    } catch (error) {
        throw Error(error as string)
    }
}

export async function delete_item(student_id: string) {
    const sql = `DELETE FROM students WHERE student_id='${student_id}'`
    try {
        await sendSql(sql)
        return { student_id: student_id }
    } catch (error) {
        throw Error(error as string)
    }
}