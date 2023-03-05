import express from "express";
import controller from "../Controller/notificationController.js";

const router = express.Router();
router.get("/", controller.getNotifications);
router.delete("/remove", controller.deleteNotifications);
router.put("/readNotifications",controller.readNotifications)
export default router;
