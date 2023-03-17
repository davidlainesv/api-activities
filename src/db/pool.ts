import mysql, { PoolConnection } from "mysql"

export const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "4321",
    database: "app",
    debug: false
})

export function getConnection(): Promise<PoolConnection> {
    return new Promise<PoolConnection>((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                resolve(connection)
            }
        });
    })
}

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

