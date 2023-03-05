import express from "express";
import { FriendControllerInstance as FriendController } from "../Controller/friendController.js";
const router = express.Router();
router.get("/", FriendController.getFriends);
router.post("/request", FriendController.requestFriend);
router.post("/add", FriendController.addFriend);
router.delete("/remove", FriendController.removeFriend);
export default router;
