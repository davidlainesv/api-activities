import express from 'express'
import * as controller from './controller'
import { HttpResponseActivity } from './model'

const router = express.Router()

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
router.post('/', async (req, res) => {
    try {
        // 1. obtener el cuerpo de la llamada que recibió
        const body = req.body

        // 2. insertar el body que recibió en la base de datos
        const createdActivity: HttpResponseActivity = await controller.insert_activity(body)

        // [opcional] 3. trabajar con el objeto que representa la actividad creada
        // createdActivity.date_time.setSeconds(100)

        // 4. convertir el objeto a JSON y devolverlo como un HTTP Response de código 201
        return res.status(201).json(createdActivity)
    } catch (error) {
        console.log("request", req)
        console.log("request body", req.body)
        console.log("server error", error)
        return res.json({
            message: "No hemos podido agregar la actividad",
            server_error: error
        })
    }
})

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
router.get('/', async (req, res) => {
    if (req.query.id) {
        try {
            const result = await controller.select_activity(req.query.id as string)
            return res.json(result);
        } catch (error) {
            return res.status(404).json({ message: "No hemos encontrado la actividad." })
        }
    }

    try {
        const results = await controller.select_activities()
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

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
router.get('/:id', async (req, res) => {
    // ej. HTTP GET a "/activities/20"
    try {
        // 1. obtener el id que el cliente me mandó a través de la consulta
        const requestedId = req.params.id as string

        // 2. consultar la actividad con ese id en la base de datos
        const activitySelected = await controller.select_activity(requestedId)

        // 3. devolver la actividad en formato JSON con código 200 (default)
        return res.json(activitySelected)
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado la actividad.",
            server_error: String(error)
        })
    }

})

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
router.put('/:id', async function (req, res) {
    try {
        controller.select_activity(req.params.id);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado la actividad.",
            server_error: error
        });
    }

    try {
        const results = await controller.update_activity(req.params.id as string, req.body);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({
            message: "Error al guardar la actividad.",
            server_error: error
        });
    }
})

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
router.delete('/:id', async function (req, res) {
    try {
        controller.select_activity(req.params.id as string);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado la actividad.",
            server_error: error
        });
    }

    try {
        const result = await controller.delete_activity(req.params.id as string);
        return res.json({ id: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error al eliminar la actividad.",
            server_error: error
        });
    }
})

export default router