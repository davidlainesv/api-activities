import express from 'express'
import * as controller from './controller'

const router = express.Router()

/**
 * @api {post} /students Crea un nuevo estudiante
 * @apiName CreateStudent
 * @apiGroup Student
 *
 * @apiSuccess (201) {String} student_id    Id del estudiante.
 * @apiSuccess (201) {String} name          Nombre del estudiante.
 * @apiSuccess (201) {Boolean} active       El estudiante está activo o no.
 * @apiSuccess (201) {String} email         Email del estudiante.
 * @apiSuccess (201) {String} notes         Notas sobre el estudiante.
 */
router.post('/', async (req, res) => {
    try {
        const result = await controller.insert_item(req.body)
        return res.status(201).json(result)
    } catch (error) {
        console.log("request", req)
        console.log("request body", req.body)
        console.log("server error", error)
        return res.json({
            message: "No hemos podido agregar al estudiante",
            server_error: error
        })
    }
})

/**
 * @api {get} /students Obtiene la lista entera de estudiantes
 * @apiName GetStudents
 * @apiGroup Student
 * @apiDescription La tabla debajo describe los campos por cada elemento dentro de la lista.
 *
 * @apiSuccess {String}     students.student_id     Id del estudiante.
 * @apiSuccess {String}     students.name           Nombre del estudiante.
 * @apiSuccess {Boolean}    students.active         El estudiante está activo o no.
 * @apiSuccess {String}     students.email          Email del estudiante.
 * @apiSuccess {String}     students.notes          Notas sobre el estudiante.
 */
/**
 * @api {get} /students?id={id} Obtiene un estudiante por ?id={id}
 * @apiName GetStudent
 * @apiGroup Student
 * 
 * @apiParam {Number} id Id del estudiante.
 *
 * @apiSuccess {String} student_id    Id del estudiante.
 * @apiSuccess {String} name          Nombre del estudiante.
 * @apiSuccess {Boolean} active       El estudiante está activo o no.
 * @apiSuccess {String} email         Email del estudiante.
 * @apiSuccess {String} notes         Notas sobre el estudiante.
 */
router.get('/', async (req, res) => {
    if (req.query.id) {
        const item_id = +req.query.id
        try {
            const result = await controller.select_item(item_id)
            return res.json(result)
        } catch (error) {
            return res.status(404).json({ message: "No hemos encontrado al estudiante." })
        }
    }

    try {
        const results = await controller.select_items()
        return res.json(results)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

/**
 * @api {get} /students/{id} Obtiene un estudiante por /{id}
 * @apiName GetStudent2
 * @apiGroup Student
 * 
 * @apiParam {Number} id Id del estudiante.
 *
 * @apiSuccess {String} student_id    Id del estudiante.
 * @apiSuccess {String} name          Nombre del estudiante.
 * @apiSuccess {Boolean} active       Estudiante está activo o no.
 * @apiSuccess {String} email         Email del estudiante.
 * @apiSuccess {String} notes         Notas sobre el estudiante.
 */
router.get('/:id', async (req, res) => {
    const item_id = +req.params.id

    try {
        const result = await controller.select_item(item_id)
        return res.json(result)
    } catch (error) {
        return res.status(404).json({ message: "No hemos encontrado al estudiante." })
    }
})

/**
 * @api {put} /students/{id} Actualiza un estudiante
 * @apiName UpdateStudent
 * @apiGroup Student
 * 
 * @apiParam {Number} id Id del estudiante.
 * 
 * @apiBody {String}    [name]          Nombre del estudiante.
 * @apiBody {Boolean}   [active]        Estudiante está activo o no.
 * @apiBody {String}    [email]         Email del estudiante.
 * @apiBody {String}    [notes]         Notas sobre el estudiante.
 *
 * @apiSuccess {String} name          Nombre del estudiante.
 * @apiSuccess {Boolean} active       Estudiante está activo o no.
 * @apiSuccess {String} email         Email del estudiante.
 * @apiSuccess {String} notes         Notas sobre el estudiante.
 */
router.put('/:id', async function (req, res) {
    const item_id = +req.params.id

    try {
        await controller.select_item(item_id);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado al estudiante.",
            server_error: error
        });
    }

    try {
        const results = await controller.update_item(item_id, req.body);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({
            message: "Error al guardar el estudiante.",
            server_error: error
        });
    }
})

/**
 * @api {delete} /students/{id} Elimina un estudiante
 * @apiName DeleteStudent
 * @apiGroup Student
 * @apiDescription Este endpoint devuelve el Id del estudiante eliminado
 * 
 * @apiParam {Number} id Id del estudiante.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [deleted_id]
 */
router.delete('/:id', async function (req, res) {
    const item_id = +req.params.id

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
        return res.json({ id: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error al eliminar el estudiante.",
            server_error: error
        });
    }
})

export default router