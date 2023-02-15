import {tokenServiceInstance  } from '../Services/tokenService.js'
import { logger } from '../Utils/Logger/logger.js'
const validateToken = tokenServiceInstance.validateAccessToken
export const accessMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) res.status(400).send("Cannot find authorization header")
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) res.status(400).send("Not access token in header")
        const userData = validateToken(accessToken)
        if (!userData) res.status(400).send("Wrong token!")
        req.user = userData;
        next();
    } catch (e) {
        logger.error(e)
    }
}