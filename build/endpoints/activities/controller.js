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
exports.delete_activity = exports.insert_activity = exports.select_activities = exports.select_activity = exports.update_activity = void 0;
const utils_1 = require("../../common/utils");
const pool_1 = require("../../db/pool");
const model_1 = require("./model");
/**
 * Actualiza una actividad en la base de datos
 * @param activity_id string con el id de la actividad
 * @param update objeto que agrupa las propiedades que se van a actualizar
 * @returns actividad completa actualizada
 */
function update_activity(activity_id, update) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql_update_entries = (0, utils_1.generate_sql_update_entries)(model_1.schema, update);
        const sql = `
        UPDATE activities SET 
        ${sql_update_entries}
        WHERE activity_id=${activity_id}
    `;
        try {
            const result = yield (0, pool_1.sendSql)(sql);
            return (0, utils_1.cast_item)(model_1.schema, result);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.update_activity = update_activity;
/**
 * Obtiene una actividad de la base de datos
 * @param activity_id string con el id de la actividad
 * @returns actividad devuelta por la base de datos
 */
function select_activity(activity_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * FROM activities WHERE activity_id=${activity_id}`;
        try {
            const results = yield (0, pool_1.sendSql)(sql);
            return (0, utils_1.cast_item)(model_1.schema, results[0]);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.select_activity = select_activity;
/**
 * Obtiene la lista completa de actividades de la base de datos
 * @returns lista de actividades devuelto por la base de datos
 */
function select_activities() {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = "SELECT * FROM activities";
        try {
            const results = yield (0, pool_1.sendSql)(sql);
            return (0, utils_1.cast_items)(model_1.schema, results);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.select_activities = select_activities;
/**
 * Inserta una actividad en la base de datos
 * @param activity actividad que se quiere agregar a la base de datos
 * @returns devuelve la actividad insertada (con ID)
 */
function insert_activity(activity) {
    return __awaiter(this, void 0, void 0, function* () {
        const priority_bit = +activity.priority;
        const sql = `
        INSERT INTO activities (description, date_time, category, priority, student_id)
        VALUES ('${activity.description}', '${activity.date_time}', '${activity.category}', ${priority_bit}, '${activity.student_id}')
    `;
        try {
            const result = yield (0, pool_1.sendSql)(sql);
            return (0, utils_1.cast_item)(model_1.schema, result);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.insert_activity = insert_activity;
/**
 * Elimina una actividad de la base de datos
 * @param activity_id string con el id de la actividad
 * @returns devuelve el id de la actividad eliminada
 */
function delete_activity(activity_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var sql = `
        DELETE FROM activities WHERE activity_id = ${activity_id}
    `;
        try {
            yield (0, pool_1.sendSql)(sql);
            return activity_id;
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.delete_activity = delete_activity;
