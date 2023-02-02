const authService = require("../Services/authService")
const {v4: uuid} = require("uuid")
const mailService = require("../Services/mailService")
const MailsModel = require("../Models/MailActivations")
const tokens = require("../Services/tokenService")

class authController {
    async registration(req, res) {
        try {
            const {registrationData} = req.body
            const userData = await authService.registration(registrationData)
            const accessLink = uuid();
            const verificationURL = `${process.env.API_URL}/verification/${accessLink}`
            await mailService.sendActivationMail(userData.user.email,verificationURL);
            await new MailsModel({user:userData.user.id,link:accessLink}).save()

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }

    }

    async login(req, res) {

        try {
            const {email, password} = req.body
            const userData = await authService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            console.log(e)
        }
    }

    async activateMail(req, res) {
        try {

            const activationLink = req.params.activationLink;
            if(!activationLink)
            {
               return  res.status(400).send("Error, not verification link");
            }
            const mailCandidate = await MailsModel.findOne({link:activationLink});
            if(!mailCandidate) {
                return res.status(404).send("Wrong link!")
            }
            mailCandidate.isActivated = true;
            await mailCandidate.save()
            return res.status(200).send("The email was activated with success!")

        } catch (e) {
            console.log("Error:",e)
            res.status(400).send(e)
        }
    }



    async logout(req, res, next) {

    }
}

module.exports = new authController()
