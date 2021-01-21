const express = require('express')
const { deleteBox, createBox, updateBox, getBox, getBoxes } = require('./box.controller')
const router = express.Router()

router.get('/', getBoxes);
router.get('/:id', getBox);
router.post('/', createBox);
router.put('/:id', updateBox);
router.delete('/:id', deleteBox)

module.exports = router