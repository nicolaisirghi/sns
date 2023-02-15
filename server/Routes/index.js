import { router as postRouter } from './Posts.js'
import { router as authRouter } from './Auth.js'
import { router as messageRouter } from "./Messages.js"
import { router as groupRouter } from "./Groups.js"
import express from 'express'
export const router = express.Router()
router.use("/posts", postRouter)
router.use("/auth", authRouter)
router.use("/messages", messageRouter)
router.use("/groups", groupRouter)