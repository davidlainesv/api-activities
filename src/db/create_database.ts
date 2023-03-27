import mysql from "mysql"

/**
 * Configuración de conexión a la base de datos
 */
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "4321"
})

/**
 * Función para crear la base de datos
 */
con.connect(function (err) {
    if (err) throw err
    console.log("Connected!")

    con.query("CREATE DATABASE app", (err, _result) => {
        if (err) throw err
        console.log("Database 'app' created")
    })
})
