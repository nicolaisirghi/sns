import "dotenv/config";
import jwt from "jsonwebtoken";
import TokenModel from "../Models/Tokens.js";

const accessKey = process.env.JWT_ACCESS_KEY;
const refreshKey = process.env.JWT_REFRESH_KEY;

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, accessKey, { expiresIn: "10000y" });
    const refreshToken = jwt.sign(payload, refreshKey, { expiresIn: "30m" });
    return { accessToken, refreshToken };
  }

  async saveToken(userID, refreshToken) {
    const tokenData = await TokenModel.findOne({ userID });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await new TokenModel({ refreshToken, user: userID }).save();
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
      return null;
    }
  }
}

export const tokenServiceInstance = new TokenService();
