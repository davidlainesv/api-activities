import mysql, { PoolConnection } from "mysql"

/**
 * Configuración de conexión múltiple a la base de datos
 */
export const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "4321",
    database: "app",
    debug: false
})


/**
 * Función para ejecutar un comando SQL sobre la base de datos
 * @param sql comando SQL
 * @returns devuelve una Promesa con la respuesta del comando SQL
 */
export function sendSql(sql: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, (err, result) => {
                    connection.release()
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            }
        });
    })
}

