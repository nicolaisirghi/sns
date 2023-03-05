import express from "express";
import { FriendControllerInstance as controller} from "../Controller/friendController.js";
const router = express.Router();
router.get("/", controller.getFriends);
router.post("/request", controller.requestFriend);
router.post("/add", controller.addFriend);
router.delete("/remove", controller.removeFriend);
export default router;
