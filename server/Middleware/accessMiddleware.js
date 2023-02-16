import {tokenServiceInstance as tokenService} from '../Services/tokenService.js'

export const accessMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) throw new Error("Cannot find authorization header")
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) throw new Error("Not access token in header")
        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            const {refreshToken} = req.session;
            const data = tokenService.validateRefreshToken(refreshToken)
            if (!data) {throw new Error('You are not logged !')}
            else {
                return res.status(200).json({
                        status: 'Refresh',
                        message: "You need to refresh token"
                    }
                )
            }
            throw new Error("Wrong token!")
        }
        req.user = userData.id;
        next();
    } catch (e) {
        next(e)
    }
}