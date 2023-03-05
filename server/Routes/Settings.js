import express from "express";
import { SettingControllerInstance as controller } from "../Controller/settingController.js";

const router = express.Router();
router.put("/changeName", controller.changeName);
router.put("/changeEducation", controller.changeEducation);
export default router;
