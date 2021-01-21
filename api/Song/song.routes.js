const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const {  getSong, addSong } = require('./song.controller')
const router = express.Router()

router.get('/', getSong);
router.post('/', addSong);


module.exports = router