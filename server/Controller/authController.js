const authService = require("../Services/authService")
const { v4: uuid } = require("uuid")
const mailService = require("../Services/mailService")
const MailsModel = require("../Models/MailActivations")
const generateRandomChars = require("../Utilities/generateRandomChars")
const textToImage = require("text-to-image")
class authController {
    async registration(req, res) {
        try {
            const { registrationData } = req.body
            const userData = await authService.registration(registrationData)
            const accessLink = uuid();
            const verificationURL = `${process.env.API_URL}/verification/${accessLink}`
            await mailService.sendActivationMail(userData.user.email, verificationURL);
            await new MailsModel({ user: userData.user.id, link: accessLink }).save()

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }

    }

    async login(req, res) {

        try {
            const { email, password } = req.body
            const userData = await authService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            console.log(e)
        }
    }

    async activateMail(req, res) {
        try {

            const activationLink = req.params.activationLink;
            if (!activationLink) {
                return res.status(400).send("Error, not verification link");
            }
            const mailCandidate = await MailsModel.findOne({ link: activationLink });
            if (!mailCandidate) {
                return res.status(404).send("Wrong link!")
            }
            mailCandidate.isActivated = true;
            await mailCandidate.save()
            return res.status(200).send("The email was activated with success!")

        } catch (e) {
            console.log("Error:", e)
            res.status(400).send(e)
        }
    }

    async generateCaptcha(req, res) {
        const captcha = generateRandomChars(6);
        console.log("Captcha : ", captcha);
        const dataUri = textToImage.generateSync(captcha, { maxWidth: 90, customHeight: 50, fontSize: 20 })
        const imgData = dataUri.split(",")[1];
        if (req.session.captcha) {
            console.log(`Captcha is ${req.session.captcha} `)
        }
        const captchaImg = Buffer.from(imgData, "base64")
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": captchaImg.length,
        });
        res.end(captchaImg);
    }

    async logout(req, res, next) {

    }
}

module.exports = new authController()
