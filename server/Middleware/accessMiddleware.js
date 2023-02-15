import {tokenServiceInstance  } from '../Services/tokenService.js'
import { logger } from '../Utils/Logger/logger.js'
const validateToken = tokenServiceInstance.validateAccessToken
export const accessMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) throw new Error("Cannot find authorization header")
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) throw new Error("Not access token in header")
        const userData = validateToken(accessToken)
        if (!userData) throw new Error("Wrong token!")
        req.user = userData;
        next();
    } catch (e) {
        next(e)
    }
}