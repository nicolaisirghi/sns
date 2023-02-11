import "dotenv/config" 
import jwt from "jsonwebtoken"
import tokenModel from "../Models/Tokens.js"
const accessKey = process.env.JWT_ACCESS_KEY
const refreshKey = process.env.JWT_REFRESH_KEY
import { logger } from "../utils/Logger/logger.js"
 class tokenService {
    generateToken(payload) {
        const accesToken = jwt.sign(payload, accessKey, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, refreshKey, {expiresIn: "30m"})
        return {accesToken, refreshToken}
    }

    async saveToken(userID, refreshToken) {
        const tokenData = await tokenModel.findOne({userID})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await new tokenModel({refreshToken, user: userID}).save();
        return token;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
            return userData;
        } catch (e) {
            return null
            
        }
    }
}

export const tokenServiceInstance = new tokenService()