"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
/**
 * Configuración de conexión a la base de datos
 */
const con = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "4321"
});
/**
 * Función para crear la base de datos
 */
con.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE app", (err, _result) => {
        if (err)
            throw err;
        console.log("Database 'app' created");
    });
});
