import express from 'express'
import activities from './endpoints/activities/router'
import students from './endpoints/students/router'

const app = express()

// middleware que transforma la req.body a un json
app.use(express.json())

const PORT = 3000

app.get("/ping", (_req, res) => {
    console.log("someone pinged here!!")
    res.send("pong")
})

app.use("/api/activites", activities)
app.use("/api/students", students)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})