import express from "express";
import {PagePostsCotrollerInstance as controller} from "../Controller/pagePostsController.js";
const router = express.Router();
router.get("/myPosts",controller.getMyPosts)
export default router;