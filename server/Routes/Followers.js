import express from "express";
import { FollowerControllerInstance as controller } from "../Controller/followersController.js";

const router = express.Router();
router.get("/", controller.getFollowers);
router.get("/followedByMe", controller.getFollowedByMe);
router.post("/follow", controller.followUser);
router.delete("/unFollow", controller.unFollowUser);
export default router;
