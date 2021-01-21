const userService = require('./user.service')
const logger = require('../../services/logger.service')
const authService = require('../auth/auth.service');
const authController = require('../auth/auth.controller')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")

require('dotenv').config()

async function getUser(req, res) {
    const {user} = req.session
    res.send(user)
}



async function getUsers(req, res) {
    try {
        const users = await userService.query(req.query)
        logger.debug(users);
        res.send(users)
    } catch (err) {
        console.log({ err });
        throw err
    }
}


async function deleteUser(req, res) {
    await userService.remove(req.params.id)
    res.end()
}

async function updateUser(req, res) {
    const user = req.body;
    req.session.user = user;
    try {
        await userService.update(user)

        res.json(user)
    } catch (err) {
        console.log({ err });
        throw err
    }
}


module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser

}