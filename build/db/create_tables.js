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
    password: "4321",
    database: "app"
});
/**
 * Comando SQL para crear la tabla de Actividades
 */
const CREATE_TABLE_ACTIVITIES_SQL = `
  CREATE TABLE activities (
    activity_id int NOT NULL AUTO_INCREMENT,
    description varchar(255),
    date_time datetime NOT NULL,
    category varchar(15),
    priority bit,
    student_id varchar(25),
    PRIMARY KEY (activity_id)
  )
`;
/**
 * Comando SQL para crear la tabla de Estudiantes
 */
const CREATE_TABLE_STUDENTS_SQL = `
  CREATE TABLE students (
    student_id varchar(25) NOT NULL,
    name varchar(255) NOT NULL,
    active bit NOT NULL,
    email varchar(25) NOT NULL,
    notes varchar(255),
    picture_name varchar(255) NULL,
    picture_type varchar(255) NULL,
    picture LONGBLOB NULL,
    PRIMARY KEY (student_id)
  )
`;
/**
 * Función para crear las tablas de Actividades y Estudiantes
 */
con.connect((err) => {
    if (err)
        throw err;
    console.log("Connected to database.");
    // Create table 'activities'
    con.query(CREATE_TABLE_ACTIVITIES_SQL, (err, _result) => {
        if (err)
            throw err;
        console.log("Table 'activities' created.");
    });
    // Create table 'students'
    con.query(CREATE_TABLE_STUDENTS_SQL, (err, _result) => {
        if (err)
            throw err;
        console.log("Table 'students' created.");
    });
});
