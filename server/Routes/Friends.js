import express from "express";
import {FriendControllerInstance as FriendController} from "../Controller/friendController.js";
export const router = express.Router()
router.get('/',FriendController.getFriends)
router.post('/add',FriendController.addFriend)
router.delete('/remove',FriendController.removeFriend)
