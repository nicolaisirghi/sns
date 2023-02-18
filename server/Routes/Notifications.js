import express from "express";
import NotificationController from "../Controller/notificationController.js";

const router = express.Router()
router.get("/",NotificationController.getNotifications)
export default router