const Role = require('../models/users/Role')
const { validationResult } = require('express-validator')
const UserService = require('../service/UserService')
const ApiError = require('../exeptions/api-error')

class userController {
    async registration (req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }
            const {username, password} = req.body
            const userData = await UserService.registration(username, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login (req, res, next) {
        try {
            const {username, password} = req.body
            const userData = await UserService.login(username, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout (req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh (req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers (req, res, next) {
        try {
            const users = await UserService.getAllUsers()
            res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async createRoles (req, res) {
        try {
            const userRole = new Role()
            const adminRole = new Role({value: '11', name: 'ADMIN'})
            await userRole.save()
            await adminRole.save()
            res.json('done')
        } catch (e) {

        }
    }
}

module.exports = new userController()