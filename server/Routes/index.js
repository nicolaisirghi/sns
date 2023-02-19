import  postRouter  from './Posts.js'
import  authRouter  from './Auth.js'
import messageRouter  from "./Messages.js"
import  groupRouter  from "./Groups.js"
import friendRouter from "./Friends.js"
import notificationRouter from "./Notifications.js";
import express from 'express'
import {accessMiddleware} from "../Middleware/accessMiddleware.js";
export const router = express.Router()
router.use("/posts",accessMiddleware, postRouter)
router.use("/auth", authRouter)
router.use("/messages",accessMiddleware, messageRouter)
router.use("/groups", groupRouter)
router.use("/friends",accessMiddleware,friendRouter)
router.use("/notifications",accessMiddleware,notificationRouter)