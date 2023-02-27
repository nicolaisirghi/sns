import express from "express";
import NotificationController from "../Controller/notificationController.js";

const router = express.Router();
router.get("/", NotificationController.getNotifications);
router.delete("/remove", NotificationController.deleteNotifications);
router.put("/readNotifications",NotificationController.readNotifications)
export default router;
