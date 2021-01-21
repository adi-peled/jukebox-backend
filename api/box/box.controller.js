const boxService = require('./box.service')
const logger = require('../../services/logger.service')

async function getBox(req, res) {
    const box = await boxService.getById(req.params.id)
    res.json(box)
}


async function getBoxes(req, res) {
    try {
        const boxes = await boxService.query(req.query)
        res.send(boxes)
    } catch (err) {
        throw err;
    }
}

async function deleteBox(req, res) {
    try {
        await boxService.remove(req.params.id)
        res.end()
    } catch (err) {
        console.log('f', { err });
        throw err
    }

}

async function updateBox(req, res) {
    const box = req.body;
    try {
        await boxService.update(box)
        res.json(box)
    } catch (err) {
        console.log({ err });
        throw err
    }
}

async function createBox(req, res) {
    const box = req.body;
    try {
        await boxService.add(box)
        res.json(box)
    } catch (err) {
        console.log({ err });
        throw err
    }
}


module.exports = {
    getBox,
    getBoxes,
    deleteBox,
    updateBox,
    createBox,
}