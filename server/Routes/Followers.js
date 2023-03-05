import express from "express";
import {FollowerControllerInstance as FollowerController} from "../Controller/followersController.js";
const router = express.Router();
router.get("/", FollowerController.getFollowers);
router.get("/followedByMe", FollowerController.getFollowedByMe);
router.post("/follow", FollowerController.followUser);
router.delete("/unFollow", FollowerController.unFollowUser);
export default router;
