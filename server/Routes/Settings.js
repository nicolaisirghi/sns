import express from "express";
import {SettingControllerInstance as SettingController} from "../Controller/settingController.js";

 const router = express.Router();
router.put("/changeName",SettingController.changeName)
export default router