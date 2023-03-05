import express from "express";
import { accessMiddleware } from "../Middleware/accessMiddleware.js";
import { authControllerInstance as controller } from "../Controller/authController.js";

const router = express.Router();
router.post("/registration", controller.registration);
router.post("/login", controller.login);
router.get(
  "/verification/:activationLink",
  accessMiddleware,
  controller.activateMail
);
router.delete("/logout", controller.logout);
router.get("/me", accessMiddleware, controller.getMe);
router.get("/refresh", controller.refresh);
export default router;
