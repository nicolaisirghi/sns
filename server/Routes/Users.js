import express from "express";
import { userControler as controller } from "../Controller/userController.js";
import { accessMiddleware } from "../Middleware/accessMiddleware.js";

const router = express.Router();

router.get("/getUsers", controller.getUserNameByRegex);

export default router;
