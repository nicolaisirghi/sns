import express from "express";
import { FollowerControllerInstance as controller } from "../Controller/followersController.js";

const router = express.Router();
router.get("/", controller.getFollowers);
router.get("/followedByMe", controller.getFollowedByMe);
router.post("/follow", controller.followUser);
router.delete("/unFollow", controller.unFollowUser);
router.get("/checkFollower", controller.checkFollower);
export default router;
