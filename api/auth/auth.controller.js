const authService = require('./auth.service')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
require('dotenv').config()


async function login(req, res) {
    const { email, password } = req.body
    try {
        const user = await authService.login(email, password)
        if (user) {
            req.session.user = user;
        }
        res.json(user)
    } catch (err) {
        console.log('auth controller', { err });
        throw err
    }
}

async function signup(req, res) {
    const { email, password, username, imgString } = req.body
    try {
        const user = await authService.signup(email, password, username, imgString)
        console.log({ user });
        if (user) {
            req.session.user = user;
        } else {
            return res.status(422).send(({ err: 'something went wrong' }))
        }
        // if (!user) return res.json(user)
        // const token = _createToken(user._id)
        res.json(user)
    } catch (err) {
        logger.error('[SIGNUP] ' + err)
        res.status(500).send({ error: 'could not signup, please try later' })
    }
}


async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}


async function forgotPassword(req, res) {
    const { email } = req.params
    try {
        const users = await userService.query()
        const user = users.find(user => user.email === email)
        const token = _createToken(user._id)
    } catch (err) {
        console.log({ err });
        throw err
    }
}



module.exports = {
    login,
    signup,
    logout,
    forgotPassword,
}