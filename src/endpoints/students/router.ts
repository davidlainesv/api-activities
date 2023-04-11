import express from 'express'
import multer from 'multer';
import * as controller from './controller'
import { readFileAsync } from '../../common/utils';

const router = express.Router()


const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, _file, cb) {
        cb(null, req.params.id)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(_req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            callback(new Error('Please upload a valid image.'))
        }
        callback(null, true)
    },
    storage: storage
});

router.post('/upload-picture/:id', upload.single('picture'), async (req, res) => {
    const student_id = req.params.id as string

    try {
        if (req.file) {
            const imageFile = req.file.path;
            const imageName = req.file.filename;
            const imageType = req.file.mimetype;

            // Read the image data from the file
            const imageData = await readFileAsync(imageFile);

            // execute sql command
            const result = await controller.insert_picture(student_id, imageName, imageType, imageData)
            return res.status(201).json(result)
        } else {
            return res.status(400).json({
                message: "No encontramos el archivo dentro de la solicitud HTTP",
                server_error: null
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "No hemos podido subir la foto",
            server_error: error
        })
    }
})



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
router.post('/', async (req, res) => {
    try {
        const result = await controller.insert_item(req.body)
        return res.status(201).json(result)
    } catch (error) {
        return res.status(500).json({
            message: "No hemos podido agregar al estudiante",
            server_error: error
        })
    }
})

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
router.get('/', async (req, res) => {
    if (req.query.id) {
        const item_id = req.query.id as string
        try {
            const result = await controller.select_item(item_id)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(404).json({ message: "No hemos encontrado al estudiante." })
        }
    }

    try {
        const results = await controller.select_items()
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener estudiante",
            server_error: error
        })
    }
})

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
router.get('/:id', async (req, res) => {
    const item_id = req.params.id as string
    try {
        const result = await controller.select_item(item_id)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado al estudiante.",
            server_error: error
        })
    }
})

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
router.put('/:id', async function (req, res) {
    const item_id = req.params.id as string

    try {
        await controller.select_item(item_id);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado al estudiante.",
            server_error: error
        });
    }

    try {
        const result = await controller.update_item(item_id, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Error al guardar el estudiante.",
            server_error: error
        });
    }
})

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
router.delete('/:id', async function (req, res) {
    const item_id = req.params.id as string

    try {
        await controller.select_item(item_id);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado al estudiante.",
            server_error: error
        });
    }

    try {
        const result = await controller.delete_item(item_id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el estudiante.",
            server_error: error
        });
    }
})

export default router