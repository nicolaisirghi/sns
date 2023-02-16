import bcrypt from 'bcrypt'
import Users from '../Models/Users.js'
import { logger } from '../Utils/Logger/logger.js'
import { getToken } from '../Utils/Token/getToken.js'
import { tokenServiceInstance as tokenService } from './tokenService.js'
import tokens from "../Models/Tokens.js";
class authService {
    async registration(registrationData) {
        const {email, password} = registrationData
        const userCandidate = await Users.findOne({email})
        if (userCandidate) {
            throw new Error(`An user with email ${email} already exist!`);

        }
        const hashPassword = await bcrypt.hash(password, 2)
        const payload = {...registrationData, password: hashPassword}
        const user = await new Users(payload).save();
        const data = await getToken(user)
        return data

    }

    async refresh(refreshToken) {
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenCandidate = await tokens.findOne({refreshToken});
            if (!userData || !tokenCandidate) {
                throw new Error("Not token")
            }
            const user = await Users.findById(userData.id);
            const data = await getToken(user)
            return data
    }

    async login(email, password) {
        const user = await Users.findOne({email})
        if (!user) {
            throw new Error(`User with this data didn't exist`)
        }
        const isPasswordEquals = await bcrypt.compare(password, user.password)
        if (!isPasswordEquals) {
            throw new Error( `User with this data didn't exist`)
        }
        const data = await getToken(user)
        return data
    }
}

export const authServiceInstance = new authService()