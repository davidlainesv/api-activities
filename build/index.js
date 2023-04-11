"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./endpoints/activities/router"));
const router_2 = __importDefault(require("./endpoints/students/router"));
const PORT = 8080;
const app = (0, express_1.default)();
// middleware que transforma la req.body a un json
app.use(express_1.default.json());
// define un endpoint /ping de prueba
app.get("/ping", (_req, res) => {
    console.log("someone pinged here!");
    res.send("pong");
});
// define el router activities para el endpoint /api/activities
app.use("/api/activities", router_1.default);
// define el router students para el endpoint /api/students
app.use("/api/students", router_2.default);
// inicializa la API en el puerto <PORT>
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
