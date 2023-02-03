const express = require("express")
const router = express.Router()
const accessMiddleware = require("../Middleware/authMiddleware")
const authController = require("../Controller/authController")
router.post("/registration",authController.registration)
router.post("/login",authController.login)
router.get("/verification/:activationLink",accessMiddleware,authController.activateMail)
router.get("/generateCaptcha",authController.generateCaptcha)
module.exports=router