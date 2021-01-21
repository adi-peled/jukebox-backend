const bcrypt = require("bcryptjs")
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const saltRounds = 10

async function login(email, password) {

    if (!email || !password) return null
    const user = await userService.getByEmail(email)
    if (!user) return null
    const match = await bcrypt.compare(password, user.password)
    if (!match) return null
    delete user.password
    return user
}



async function signup(email, password, username,imgString) {
    logger.debug(`auth.service - signup with email: ${email}`)
    if (!email || !password) return Promise.reject('email and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    return await userService.add({ email, password: hash, username,imgString })
}










module.exports = {
    signup,
    login,
}