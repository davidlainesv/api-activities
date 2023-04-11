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
exports.delete_item = exports.insert_item = exports.select_items = exports.select_item = exports.update_item = exports.insert_picture = void 0;
const utils_1 = require("../../common/utils");
const pool_1 = require("../../db/pool");
const model_1 = require("./model");
function insert_picture(student_id, _imageName, _imageType, imageData) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `
        UPDATE students SET
        picture_name=?,
        picture_type=?,
        picture=?
        WHERE student_id='${student_id}'
    `;
        try {
            yield (0, pool_1.sendSql)(sql, [_imageName, _imageType, imageData]);
            return select_item(student_id);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.insert_picture = insert_picture;
function update_item(student_id, update) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql_update_entries = (0, utils_1.generate_sql_update_entries)(model_1.schema, update);
        const sql = `
        UPDATE students SET 
        ${sql_update_entries}
        WHERE student_id='${student_id}'
    `;
        try {
            yield (0, pool_1.sendSql)(sql);
            return select_item(student_id);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.update_item = update_item;
function select_item(student_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * FROM students WHERE student_id='${student_id}'`;
        try {
            const results = yield (0, pool_1.sendSql)(sql);
            return (0, utils_1.cast_item)(model_1.schema, results[0]);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.select_item = select_item;
function select_items() {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = "SELECT * FROM students";
        try {
            const results = yield (0, pool_1.sendSql)(sql);
            return (0, utils_1.cast_items)(model_1.schema, results);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.select_items = select_items;
function insert_item(student) {
    return __awaiter(this, void 0, void 0, function* () {
        const active_bit = +student.active;
        const sql = `
        INSERT INTO students (student_id, name, active, email, notes)
        VALUES ('${student.student_id}', '${student.name}', ${active_bit}, '${student.email}', '${student.notes}')
    `;
        try {
            yield (0, pool_1.sendSql)(sql); // => ResultSetHeader
            return select_item(student.student_id);
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.insert_item = insert_item;
function delete_item(student_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `DELETE FROM students WHERE student_id='${student_id}'`;
        try {
            yield (0, pool_1.sendSql)(sql);
            return { student_id: student_id };
        }
        catch (error) {
            throw Error(error);
        }
    });
}
exports.delete_item = delete_item;
