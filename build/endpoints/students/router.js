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
const multer_1 = __importDefault(require("multer"));
const controller = __importStar(require("./controller"));
const utils_1 = require("../../common/utils");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, _file, cb) {
        cb(null, req.params.id);
    }
});
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 1000000
    },
    fileFilter(_req, file, callback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            callback(new Error('Please upload a valid image.'));
        }
        callback(null, true);
    },
    storage: storage
});
router.post('/upload-picture/:id', upload.single('picture'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const student_id = req.params.id;
    try {
        if (req.file) {
            const imageFile = req.file.path;
            const imageName = req.file.filename;
            const imageType = req.file.mimetype;
            // Read the image data from the file
            const imageData = yield (0, utils_1.readFileAsync)(imageFile);
            // execute sql command
            const result = yield controller.insert_picture(student_id, imageName, imageType, imageData);
            return res.status(201).json(result);
        }
        else {
            return res.status(400).json({
                message: "No encontramos el archivo dentro de la solicitud HTTP",
                server_error: null
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "No hemos podido subir la foto",
            server_error: error
        });
    }
}));
/**
 * @api {post} /students Crea un nuevo estudiante
 * @apiName CreateStudent
 * @apiGroup Student
 *
 * @apiBody {String}    student_id      Matrícula del estudiante.
 * @apiBody {String}    name            Nombre del estudiante.
 * @apiBody {Boolean}   active          Si el estudiante está activo o no.
 * @apiBody {String}    email           Email del estudiante.
 * @apiBody {String}    notes           Notas sobre el estudiante.
 *
 * @apiSuccess (201) {String}   student_id    Matrícula del estudiante
 * @apiSuccess (201) {String}   name          Nombre del estudiante.
 * @apiSuccess (201) {Boolean}  active        Si el estudiante está activo o no.
 * @apiSuccess (201) {String}   email         Email del estudiante.
 * @apiSuccess (201) {String}   notes         Notas sobre el estudiante.
 */
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield controller.insert_item(req.body);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(500).json({
            message: "No hemos podido agregar al estudiante",
            server_error: error
        });
    }
}));
/**
 * @api {get} /students Obtiene la lista entera de estudiantes o el estudiante solicitado por el query ?id.
 * @apiName GetStudents
 * @apiGroup Student
 * @apiDescription La tabla debajo describe los campos por cada elemento devuelto.
 *
 * @apiQuery {String} id    Matrícula del estudiante
 *
 * @apiSuccess {String}     students.student_id     Matrícula del estudiante
 * @apiSuccess {String}     students.name           Nombre del estudiante.
 * @apiSuccess {Boolean}    students.active         El estudiante está activo o no.
 * @apiSuccess {String}     students.email          Email del estudiante.
 * @apiSuccess {String}     students.notes          Notas sobre el estudiante.
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id) {
        const item_id = req.query.id;
        try {
            const result = yield controller.select_item(item_id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(404).json({ message: "No hemos encontrado al estudiante." });
        }
    }
    try {
        const results = yield controller.select_items();
        return res.status(200).json(results);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error al obtener estudiante",
            server_error: error
        });
    }
}));
/**
 * @api {get} /students/:id Obtiene un estudiante por /:id
 * @apiName GetStudent2
 * @apiGroup Student
 *
 * @apiParam {Number} id Matrícula del estudiante
 *
 * @apiSuccess {String}     student_id   Matrícula del estudiante
 * @apiSuccess {String}     name         Nombre del estudiante.
 * @apiSuccess {Boolean}    active       Estudiante está activo o no.
 * @apiSuccess {String}     email        Email del estudiante.
 * @apiSuccess {String}     notes        Notas sobre el estudiante.
 */
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item_id = req.params.id;
    try {
        const result = yield controller.select_item(item_id);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado al estudiante.",
            server_error: error
        });
    }
}));
/**
 * @api {put} /students/:id Actualiza un estudiante
 * @apiName UpdateStudent
 * @apiGroup Student
 *
 * @apiParam {Number} id Matrícula del estudiante
 *
 * @apiBody {String}    [name]          Nombre del estudiante.
 * @apiBody {Boolean}   [active]        Estudiante está activo o no.
 * @apiBody {String}    [email]         Email del estudiante.
 * @apiBody {String}    [notes]         Notas sobre el estudiante.
 *
 * @apiSuccess {String}     name        Nombre del estudiante.
 * @apiSuccess {Boolean}    active      Estudiante está activo o no.
 * @apiSuccess {String}     email       Email del estudiante.
 * @apiSuccess {String}     notes       Notas sobre el estudiante.
 */
router.put('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const item_id = req.params.id;
        try {
            yield controller.select_item(item_id);
        }
        catch (error) {
            return res.status(404).json({
                message: "No hemos encontrado al estudiante.",
                server_error: error
            });
        }
        try {
            const result = yield controller.update_item(item_id, req.body);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                message: "Error al guardar el estudiante.",
                server_error: error
            });
        }
    });
});
/**
 * @api {delete} /students/:id Elimina un estudiante
 * @apiName DeleteStudent
 * @apiGroup Student
 * @apiDescription Este endpoint devuelve la matrícula del estudiante eliminado
 *
 * @apiParam    {Number}    id              Matrícula del estudiante
 *
 * @apiSuccess  {String}    student_id      Matrícula del estudiante
 */
router.delete('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const item_id = req.params.id;
        try {
            yield controller.select_item(item_id);
        }
        catch (error) {
            return res.status(404).json({
                message: "No hemos encontrado al estudiante.",
                server_error: error
            });
        }
        try {
            const result = yield controller.delete_item(item_id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                message: "Error al eliminar el estudiante.",
                server_error: error
            });
        }
    });
});
exports.default = router;
