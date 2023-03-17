import express from 'express'

const router = express.Router()

// create item
router.post('/', async (req, res) => {
    try {
        // const result = await controller.insert_activity(pool, req.body)
        const result = null
        return res.status(201).json(result)
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

// read items
router.get('/', async (req, res) => {
    if (req.query.id) {
        try {
            // const result = await controller.select_activity(pool, req.query.id)
            const result = null
            return res.json(result);
        } catch (error) {
            return res.status(404).json({ message: "No hemos encontrado la actividad." })
        }
    }

    try {
        // const results = await controller.select_activities(pool)
        const results = null
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

// read item
router.get('/:id', async (_req, res) => {
    try {
        // const result = await controller.select_activity(pool, req.params.id)
        const result = null
        return res.json(result)
    } catch (error) {
        return res.status(404).json({ message: "No hemos encontrado la actividad." })
    }

})

// update item
router.put('/:id', async function (_req, res) {
    try {
        // const _ = await controller.select_activity(pool, req.params.id);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado la actividad.",
            server_error: error
        });
    }

    try {
        // const results = await controller.update_activity(pool, req.params.id, req.body);
        const results = null
        return res.json(results);
    } catch (error) {
        return res.status(500).json({
            message: "Error al guardar la actividad.",
            server_error: error
        });
    }
})

// delete item
router.delete('/:id', async function (_req, res) {
    try {
        // const _ = await controller.select_activity(pool, req.params.id);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado la actividad.",
            server_error: error
        });
    }

    try {
        // const result = await controller.delete_activity(pool, req.params.id);
        const result = null
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