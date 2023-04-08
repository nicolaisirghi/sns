import express from "express";
import { accessMiddleware } from "../Middleware/accessMiddleware.js";
import { CommentControllerInstance as controler } from "../Controller/commentController.js";

const router = express.Router();
router.get("/getByID", controler.getCommentsByID);
router.post("/getByID", controler.addComment);
router.post("/addLike", controler.addLike);
router.post("/addAnswer", controler.addAnswer);
export default router;
