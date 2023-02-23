import express from "express";
import { messageControllerInstance as messageController } from "../Controller/messageController.js";
import { friendAccessMiddleware } from "../Middleware/friendAccessMiddleware.js";

const router = express.Router();
router.get("/chats", messageController.getChats);
router.post("/addMessage", friendAccessMiddleware, messageController.addMessage);
router.get("/getMessages/:toUser", messageController.getMessages);
export default router;
