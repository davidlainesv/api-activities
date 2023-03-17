import express from 'express'
import * as controller from './controller'

const router = express.Router()

// create item
router.post('/', async (req, res) => {
    try {
        const result = await controller.insert_item(req.body)
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
        const item_id = +req.query.id
        try {
            const result = await controller.select_item(item_id)
            return res.json(result)
        } catch (error) {
            return res.status(404).json({ message: "No hemos encontrado la actividad." })
        }
    }

    try {
        const results = await controller.select_items()
        return res.json(results)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

// read item
router.get('/:id', async (req, res) => {
    const item_id = +req.params.id

    try {
        const result = await controller.select_item(item_id)
        return res.json(result)
    } catch (error) {
        return res.status(404).json({ message: "No hemos encontrado la actividad." })
    }
})

// update item
router.put('/:id', async function (req, res) {
    const item_id = +req.params.id

    try {
        await controller.select_item(item_id);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado la actividad.",
            server_error: error
        });
    }

    try {
        const results = await controller.update_item(item_id, req.body);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({
            message: "Error al guardar la actividad.",
            server_error: error
        });
    }
})

// delete item
router.delete('/:id', async function (req, res) {
    const item_id = +req.params.id

    try {
        await controller.select_item(item_id);
    } catch (error) {
        return res.status(404).json({
            message: "No hemos encontrado la actividad.",
            server_error: error
        });
    }

    try {
        const result = await controller.delete_item(item_id);
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