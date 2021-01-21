const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, deleteUser, updateUser } = require('./user.controller')
const router = express.Router()


router.get('/', getUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)
router.put('/:id', requireAuth, updateUser);


module.exports = router