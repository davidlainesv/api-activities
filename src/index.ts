import express from 'express'
import activities from './endpoints/activities/router'
import students from './endpoints/students/router'

const PORT = 8080

const app = express()

// middleware que transforma la req.body a un json
app.use(express.json())

// define un endpoint /ping de prueba
app.get("/ping", (_req, res) => {
    console.log("someone pinged here!")
    res.send("pong")
})

// define el router activities para el endpoint /api/activities
app.use("/api/activities", activities)

// define el router students para el endpoint /api/students
app.use("/api/students", students)

// inicializa la API en el puerto <PORT>
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})