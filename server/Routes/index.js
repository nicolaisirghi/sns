import postRouter from "./Posts.js";
import authRouter from "./Auth.js";
import messageRouter from "./Messages.js";
import groupRouter from "./Groups.js";
import friendRouter from "./Friends.js";
import notificationRouter from "./Notifications.js";
import publicationsRouter from "./Publications.js"
import settingsRouter from "./Settings.js"
import followerRouter from "./Followers.js"
import pagePostsRouter from "./PagePosts.js";
import express from "express";
import { accessMiddleware } from "../Middleware/accessMiddleware.js";
export const router = express.Router();
router.use("/posts", accessMiddleware, postRouter);
router.use("/auth", authRouter);
router.use("/messages", accessMiddleware, messageRouter);
router.use("/groups", groupRouter);
router.use("/friends", accessMiddleware, friendRouter);
router.use("/notifications", accessMiddleware, notificationRouter);
router.use("/publications",publicationsRouter)
router.use("/settings",accessMiddleware,settingsRouter)
router.use("/followers",accessMiddleware,followerRouter)
router.use("/pagePosts",accessMiddleware,pagePostsRouter)