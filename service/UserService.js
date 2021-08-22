const User = require('../models/users/User')
const Role = require("../models/users/Role");
const bcrypt = require("bcrypt");
const tokenService = require('./TokenService')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exeptions/api-error')

class UserService {
    async registration(username, password) {
        const candidate = await User.findOne({userName: username})
        if (candidate) {
            throw ApiError.BadRequest('Пользователь уже есть')
        }
        const userRole = await Role.findOne({name: 'USER'})
        const hashPassword = bcrypt.hashSync(password, 7)
        const user = await User.create({userName: username, password: hashPassword, roles: [userRole.value]})
        const userDto = new UserDto(user)
        const token = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, token.refreshToken )
        return {
            ...token,
            user: userDto
        }
    }

    async login(username, password) {
        const user = await User.findOne({userName: username})
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const isValidPassword = bcrypt.compareSync(password, user.password )
        if (!isValidPassword) {
            throw ApiError.BadRequest('Неверный пароль')
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken )
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findById(userData.id)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken )
        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers () {
        const users = User.find()
        return users
    }
}

module.exports = new UserService()