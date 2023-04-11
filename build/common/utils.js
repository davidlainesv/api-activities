"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileAsync = exports.cast_items = exports.cast_item = exports.generate_sql_update_entries = exports.format_datetime = void 0;
const luxon_1 = require("luxon");
const fs_1 = require("fs");
/**
 * Convierte un objeto fecha de javascript en formato string "yyyy-MM-dd HH:mm:ss"
 * @param date fecha de entrada
 * @returns cadena de fecha en formato "yyyy-MM-dd HH:mm:ss" compatible con SQL
 */
function format_datetime(date) {
    const datetime = luxon_1.DateTime.fromJSDate(date);
    return datetime.toUTC().toFormat("yyyy-MM-dd HH:mm:ss");
}
exports.format_datetime = format_datetime;
/**
 *
 * @param schema objeto \{"nombre_propiedad": "tipo_de_dato", ...\} con la estructura que define al parámetro values
 * @param values comando de SQL con las entradas de actualización para cada propiedad del parámetro values
 * @returns
 */
function generate_sql_update_entries(schema, values) {
    const forbidden_properties = ["activity_id", "student_id"];
    var update_entries = [];
    for (const prop in values) {
        if (!(prop in forbidden_properties)) {
            var entry = "";
            if (schema[prop] == "string") {
                entry = `${prop} = '${values[prop]}'`;
            }
            else {
                entry = `${prop} = ${values[prop]}`;
            }
            update_entries.push(entry);
        }
    }
    return update_entries.join(", ");
}
exports.generate_sql_update_entries = generate_sql_update_entries;
/**
 * Convierte un objeto SQL a un objeto HttpResponseStudent o HttpResponseActivity
 * @param schema objeto que describe los tipos de datos de las propiedades del objeto SQL
 * @param item objeto devuelto por una operación SQL
 * @returns objeto de tipo HttpResponseStudent o HttpResponseActivity
 */
function cast_item(schema, item) {
    var casted = {};
    for (const prop in item) {
        if (schema[prop] === "string" && item[prop] !== null) {
            casted[prop] = String(item[prop]);
        }
        else if (schema[prop] === "date" && item[prop] !== null) {
            // 2023-04-11T16:58:19.000Z
            casted[prop] = luxon_1.DateTime.fromFormat(item[prop], "yyyy-MM-ddTHH:mm:ss").toJSDate();
        }
        else if (schema[prop] === "boolean" && item[prop] !== null) {
            casted[prop] = Boolean(item[prop]);
        }
        else if (schema[prop] === "image" && item[prop] !== null) {
            casted[prop] = `data:${casted[prop + "_type"]};base64,${item[prop].toString('base64')}`;
        }
        else {
            casted[prop] = item[prop];
        }
    }
    return casted;
}
exports.cast_item = cast_item;
/**
 * Convierte una lista de objetos SQL a una lista de objetos HttpResponseStudent o HttpResponseActivity
 * @param schema objeto que describe los tipos de datos de las propiedades de los objetos SQL
 * @param item lista de objetos devuelto por una operación SQL
 * @returns lista de objetos de tipo HttpResponseStudent o HttpResponseActivity
 */
function cast_items(schema, items) {
    return items.map(item => {
        return cast_item(schema, item);
    });
}
exports.cast_items = cast_items;
/**
 *
 * @param filePath ruta del archivo a leer
 * @returns una promesa que devuelve el archivo en formato Buffer
 */
function readFileAsync(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            (0, fs_1.readFile)(filePath, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    });
}
exports.readFileAsync = readFileAsync;
