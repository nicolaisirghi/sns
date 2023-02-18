import express from "express";
import {messageControllerInstance as messageController} from "../Controller/messageController.js";

 const router = express.Router()
router.get("/chats",messageController.getChats)
router.post("/addMessage/:toUser",messageController.addMessage)
router.get("/getMessages/:toUser",messageController.getMessages)
export default router