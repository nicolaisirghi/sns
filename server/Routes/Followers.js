import express from "express";
import {FollowerControllerInstance as FollowerController} from "../Controller/followersController.js";
const router = express.Router();
router.get("/", FollowerController.getFollowers);
router.post("/add", FollowerController.followUser);
export default router;
