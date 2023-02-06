const {v4: uuid} = require("uuid")
const authService = require("../Services/authService")
const mailService = require("../Services/mailService")
const MailsModel = require("../Models/MailActivations")
const generateCaptcha = require("../Utilities/generateCaptcha")

class authController {
    constructor() {
        // this.generateCaptcha = this.generateCaptcha.bind(this)
        this.verifyCaptcha = this.verifyCaptcha.bind(this)
    }

    async registration(req, res, next) {
        try {
            const {registrationData} = req.body
            const userData = await authService.registration(registrationData)
            const accessLink = uuid();
            const verificationURL = `${process.env.API_URL}/verification/${accessLink}`
            await mailService.sendActivationMail(userData.user.email, verificationURL);
            await new MailsModel({user: userData.user.id, link: accessLink}).save()

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }

    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await authService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (err) {
            next(err)

        }
    }

    async activateMail(req, res, next) {
        try {

            const activationLink = req.params.activationLink;
            if (!activationLink) {
                throw new Error("Error, not verification link");
            }
            const mailCandidate = await MailsModel.findOne({link: activationLink});
            if (!mailCandidate) {
                throw new Error("Wrong link!")
            }
            mailCandidate.isActivated = true;
            await mailCandidate.save()
            res.status(200).send("The email was activated with success!")

        } catch (e) {
            next(e)
        }
    }


    getCaptcha(req, res, next) {
        try {
            const {captcha, imgData} = generateCaptcha();
            req.session.captcha = captcha;
            const captchaImg = Buffer.from(imgData, "base64")
            res.writeHead(200, {
                "Content-Type": "image/png",
                "Content-Length": captchaImg.length,
            });
            res.end(captchaImg);
        } catch (e) {
            next(e)
        }
    }

    verifyCaptcha(req, res, next) {
        try {
            const captchaRequest = req.body.captcha;
            if (!captchaRequest) throw new Error(`Error, not captcha in your request`)
            const isVerified = captchaRequest === req.session.captcha
            res.status(200).json({isVerified})
        } catch (e) {
            next(e)
        }

    }
}

module.exports = new authController()
