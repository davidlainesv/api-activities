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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSql = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
/**
 * Configuración de conexión múltiple a la base de datos
 */
exports.pool = promise_1.default.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "4321",
    database: "app",
    debug: false
});
/**
 * Función para ejecutar un comando SQL sobre la base de datos
 * @param sql comando SQL
 * @returns devuelve una Promesa con la respuesta del comando SQL
 */
// export function sendSql(sql: string): Promise<any> {
//     return new Promise<any>((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 reject(err)
//             } else {
//                 connection.query(sql, (err, result) => {
//                     connection.release()
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve(result)
//                     }
//                 })
//             }
//         });
//     })
// }
function sendSql(sql, values) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield exports.pool.getConnection();
        try {
            const [rows, _fields] = yield connection.query(sql, values);
            return rows;
        }
        catch (error) {
            throw Error(error);
        }
        finally {
            connection.release();
        }
    });
}
exports.sendSql = sendSql;
