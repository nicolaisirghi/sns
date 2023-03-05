import express from "express";
import { messageControllerInstance as controller } from "../Controller/messageController.js";
import { friendAccessMiddleware } from "../Middleware/friendAccessMiddleware.js";

const router = express.Router();
router.get("/chats", controller.getChats);
router.post("/addMessage", friendAccessMiddleware, controller.addMessage);
router.get("/getMessages/:toUser", controller.getMessages);
export default router;
