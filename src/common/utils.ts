import { DateTime } from 'luxon'
import { HttpResponseActivity } from "../endpoints/activities/model"
import { HttpResponseStudent } from "../endpoints/students/model"

/**
 * Convierte un objeto fecha de javascript en formato string "yyyy-MM-dd HH:mm:ss"
 * @param date fecha de entrada
 * @returns cadena de fecha en formato "yyyy-MM-dd HH:mm:ss" compatible con SQL
 */
export function format_datetime(date: Date): string {
    const datetime = DateTime.fromJSDate(date);
    return datetime.toUTC().toFormat("yyyy-MM-dd HH:mm:ss");
}


/**
 * 
 * @param schema objeto {"nombre_propiedad": "tipo_de_dato", ...} con la estructura que define al parámetro values
 * @param values comando de SQL con las entradas de actualización para cada propiedad del parámetro values
 * @returns 
 */
export function generate_sql_update_entries(schema: any, values: any): string {
    const forbidden_properties = ["activity_id", "student_id"]

    var update_entries = [];
    for (const prop in values) {
        if (!(prop in forbidden_properties)) {
            var entry = ""
            if (schema[prop] == "string") {
                entry = `${prop} = '${values[prop]}'`;
            } else {
                entry = `${prop} = ${values[prop]}`;
            }
            update_entries.push(entry);
        }
    }

    return update_entries.join(", ")
}

/**
 * Tipo de dato que puede ser HttpResponseStudent o HttpResponseActivity
 */
type HttpResponseItemType = HttpResponseStudent | HttpResponseActivity

/**
 * Convierte un objeto SQL a un objeto HttpResponseStudent o HttpResponseActivity
 * @param schema objeto que describe los tipos de datos de las propiedades del objeto SQL
 * @param item objeto devuelto por una operación SQL
 * @returns objeto de tipo HttpResponseStudent o HttpResponseActivity
 */
export function cast_item<Type extends HttpResponseItemType>(schema: any, item: any): Type {
    var casted = {} as any
    for (const prop in item) {
        if (schema[prop] === "string") {
            casted[prop] = String(item[prop])
        } else if (schema[prop] === "date") {
            casted[prop] = DateTime.fromFormat(item[prop], "yyyy-MM-dd HH:mm:ss").toJSDate()
        } else if (schema[prop] === "boolean") {
            casted[prop] = Boolean(item[prop])
        }
        casted[prop] = item[prop]
    }
    return casted
}

/**
 * Convierte una lista de objetos SQL a una lista de objetos HttpResponseStudent o HttpResponseActivity
 * @param schema objeto que describe los tipos de datos de las propiedades de los objetos SQL
 * @param item lista de objetos devuelto por una operación SQL
 * @returns lista de objetos de tipo HttpResponseStudent o HttpResponseActivity
 */
export function cast_items<Type extends HttpResponseItemType>(schema: any, items: any[]): Type[] {
    return items.map(item => {
        return cast_item<Type>(schema, item)
    })
}