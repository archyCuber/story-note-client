const jwt = require('jsonwebtoken')
const Token = require('../models/token/Token')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'1d'})
        return {accessToken, refreshToken}
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {

        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save( )
        }
        const token = Token.create({user: userId, refreshToken})
        return token
    }

    async removeToken(token) {
        const tokenData = Token.deleteOne({refreshToken: token})
        return tokenData
    }

    async findToken(token) {
        const tokenData = Token.findOne({refreshToken: token})
        return tokenData
    }
}

module.exports = new TokenService()