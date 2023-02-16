import { tokenServiceInstance as tokenService } from '../Services/tokenService.js'
import { logger } from '../Utils/Logger/logger.js'
import { getToken } from '../Utils/Token/getToken.js'
export const accessMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) throw new Error("Cannot find authorization header")
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) throw new Error("Not access token in header")
        const userData = tokenService.validateAccessToken(accessToken)
        const refreshToken = req.session.refreshToken;

        if (!userData) {
            if (refreshToken) {
                const refreshTokenData = tokenService.validateRefreshToken(refreshToken);
                if (!refreshTokenData) {
                    delete req.session.refreshToken;
                    throw new Error('Invalid refresh token from session !')
                }
            else{
                const tokens = tokenService.generateToken(refreshTokenData)
                req.user = userData;
                res.status(200).json(tokens)
            }
            }
            else {
                throw new Error("Wrong token!")

            }
        }
            req.user = userData;
        next();
    } catch (e) {
        next(e)
    }
}