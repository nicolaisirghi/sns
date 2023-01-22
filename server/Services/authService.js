const bcrypt = require("bcrypt")
const Users = require("../Models/Users")
const tokenService = require("./tokenService")

class authService {
    async registration(registrationData) {

            const {email, password} = registrationData
            const userCandidate = await Users.findOne({email})
            if (userCandidate) {
                return {error: `An user with email ${email} already exist!`}

            }
            const hashPassword = await bcrypt.hash(password, 2)
            const payload = {...registrationData, password: hashPassword}

            const user = await new Users(payload).save();
            const userDto = {id: user._id, email: user.email}
            const tokens = tokenService.generateToken({...userDto})
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, user: userDto}


    }

    async login(email,password)
    {
        const user = await Users.findOne({email})
        if(!user)
        {
            return {error:`User with this data didn't exist`}
        }

         const isPasswordEquals = await bcrypt.compare(password,user.password)
        if(!isPasswordEquals)
        {
            return {error:`User with this data didn't exist`}
        }
        const userDto = {id: user._id, email: user.email}
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}

    }
}

module.exports = new authService()