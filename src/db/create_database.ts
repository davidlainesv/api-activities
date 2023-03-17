import mysql from "mysql"

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "4321"
})

con.connect(function (err) {
    if (err) throw err
    console.log("Connected!")

    con.query("CREATE DATABASE app", (err, _result) => {
        if (err) throw err
        console.log("Database 'app' created")
    })
})
