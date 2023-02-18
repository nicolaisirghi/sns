import express from "express"
import { accessMiddleware } from '../Middleware/accessMiddleware.js'
import { authControllerInstance as authController } from "../Controller/authController.js"
const router = express.Router()
router.post("/registration", authController.registration)
router.post("/login", authController.login)
router.get("/verification/:activationLink", accessMiddleware, authController.activateMail)
router.delete("/logout",authController.logout)
router.get("/me",accessMiddleware,authController.getMe)
router.get("/refresh",authController.refresh)
export default router