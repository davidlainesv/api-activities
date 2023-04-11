"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const controller = __importStar(require("./controller"));
const router = express_1.default.Router();
/**
 * @api {post} /activities Crea una nueva actividad
 * @apiName CreateActivity
 * @apiGroup Activity
 *
 * @apiBody {String}    description   Descripción de la actividad.
 * @apiBody {String}    date_time     Fecha de la actividad en formato yyyy/MM/dd HH:mm:ss.
 * @apiBody {String}    category      Categoría de la actividad.
 * @apiBody {Boolean}   priority      Actividad es prioritaria.
 * @apiBody {String}    student_id    Matrícula del estudiante.
 *
 * @apiSuccess (201) {Number} activity_id Id de la actividad.
 * @apiSuccess (201) {String} description Descripción de la actividad.
 * @apiSuccess (201) {String} date_time   Fecha de la actividad.
 * @apiSuccess (201) {String} category    Categoría de la actividad.
 * @apiSuccess (201) {Boolean} priority   Actividad es prioritaria.
 * @apiSuccess (201) {String} student_id  Matrícula del estudiante.
 */
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. obtener el cuerpo de la llamada que recibió
        const body = req.body;
        // 2. insertar el body que recibió en la base de datos
        const createdActivity = yield controller.insert_activity(body);
        // [opcional] 3. trabajar con el objeto que representa la actividad creada
        // createdActivity.date_time.setSeconds(100)
        // 4. convertir el objeto a JSON y devolverlo como un HTTP Response de código 201
        return res.status(201).json(createdActivity);
    }
    catch (error) {
        console.log("request", req);
        console.log("request body", req.body);
        console.log("server error", error);
        return res.json({
            message: "No hemos podido agregar la actividad",
            server_error: error
        });
    }
}));
/**
 * @api {get} /activities Obtiene la lista entera de actividades o la actividad solicitada por el query ?id.
 * @apiName GetActivities
 * @apiGroup Activity
 * @apiDescription La tabla debajo describe los campos por cada elemento devuelto.
 *
 * @apiQuery {Number} id Id de la actividad
 *
 * @apiSuccess {Number}     activities.activity_id  Id de la actividad.
 * @apiSuccess {String}     activities.description  Descripción de la actividad.
 * @apiSuccess {String}     activities.date_time    Fecha de la actividad.
 * @apiSuccess {String}     activities.category     Categoría de la actividad.
 * @apiSuccess {Boolean}    activities.priority    Actividad es prioritaria.
 * @apiSuccess {String}     activities.student_id   Matrícula del estudiante.
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id) {
        try {
            const result = yield controller.select_activity(String(req.query.id));
            return res.json(result);
        }
        catch (error) {
            return res.status(404).json({ message: "No hemos encontrado la actividad." });
        }
    }
    try {
        const results = yield controller.select_activities();
        return res.json(results);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
}));
/**
 * @api {get} /activities/:id Obtiene una actividad por /:id
 * @apiName GetActivity2
 * @apiGroup Activity
 *
 * @apiParam {Number} id Id de la actividad.
 *
 * @apiSuccess {Number}     activity_id     Id de la actividad.
 * @apiSuccess {String}     description     Descripción de la actividad.
 * @apiSuccess {String}     date_time       Fecha de la actividad.
 * @apiSuccess {String}     category        Categoría de la actividad.
 * @apiSuccess {Boolean}    priority        Actividad es prioritaria.
 * @apiSuccess {String}     student_id      Matrícula del estudiante.
 */
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ej. HTTP GET a "/activities/20"
    try {
        // 1. obtener el id que el cliente me mandó a través de la consulta
        const requestedId = String(req.params.id);
        // 2. consultar la actividad con ese id en la base de datos
        const activitySelected = yield controller.select_activity(requestedId);
        // 3. devolver la actividad en formato JSON con código 200 (default)
        return res.json(activitySelected);
    }
    catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado la actividad.",
            server_error: String(error)
        });
    }
}));
/**
 * @api {put} /activities/:id Actualiza una actividad
 * @apiName UpdateActivity
 * @apiGroup Activity
 *
 * @apiParam {Number} id Id de la actividad.
 *
 * @apiBody {String}    [description]   Descripción de la actividad.
 * @apiBody {String}    [date_time]     Fecha de la actividad en formato yyyy/MM/dd HH:mm:ss.
 * @apiBody {String}    [category]      Categoría de la actividad.
 * @apiBody {Boolean}   [priority]      Actividad es prioritaria.
 * @apiBody {String}    [student_id]    Matrícula del estudiante.
 *
 * @apiSuccess {Number} activity_id Id de la actividad.
 * @apiSuccess {String} description Descripción de la actividad.
 * @apiSuccess {String} date_time   Fecha de la actividad.
 * @apiSuccess {String} category    Categoría de la actividad.
 * @apiSuccess {Boolean} priority   Actividad es prioritaria.
 * @apiSuccess {String} student_id  Matrícula del estudiante.
 */
router.put('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            controller.select_activity(req.params.id);
        }
        catch (error) {
            return res.status(404).json({
                message: "No hemos encontrado la actividad.",
                server_error: error
            });
        }
        try {
            const results = yield controller.update_activity(String(req.params.id), req.body);
            return res.json(results);
        }
        catch (error) {
            return res.status(500).json({
                message: "Error al guardar la actividad.",
                server_error: error
            });
        }
    });
});
/**
 * @api {delete} /activities/:id Elimina una actividad
 * @apiName DeleteActivity
 * @apiGroup Activity
 * @apiDescription Este endpoint devuelve el Id de la actividad eliminada
 *
 * @apiParam {Number} id Id de la actividad.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [deleted_id]
 */
router.delete('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            controller.select_activity(String(req.params.id));
        }
        catch (error) {
            return res.status(404).json({
                message: "No hemos encontrado la actividad.",
                server_error: error
            });
        }
        try {
            const result = yield controller.delete_activity(String(req.params.id));
            return res.json({ id: result });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Error al eliminar la actividad.",
                server_error: error
            });
        }
    });
});
exports.default = router;
