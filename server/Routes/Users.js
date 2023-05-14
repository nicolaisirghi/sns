import express from "express";
import { userControler as controller } from "../Controller/userController.js";

const router = express.Router();

router.get("/getUsers", controller.getUserNameByRegex);
router.get("/getUsersOnline", controller.getUsersOnline);

export default router;
