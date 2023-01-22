const jwt = require("jsonwebtoken")
require("dotenv").config()
const secretKey = process.env.JWT_SECRET_KEY
const tokenModel = require("../Models/Tokens")
class tokenService {
    generateToken(payload) {
     const accesToken = jwt.sign(payload,secretKey,{expiresIn:"15m"})
        const refreshToken = jwt.sign(payload,secretKey,{expiresIn:"30m"})
        return {accesToken,refreshToken}
    }
    async saveToken(userID,refreshToken)
    {
        const tokenData = await tokenModel.findOne({refreshToken})
        if(tokenData)
        {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await new tokenModel({refreshToken, user: userID}).save();
    }
}
module.exports = new  tokenService()