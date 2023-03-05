import express from "express";
import { PagePostsCotrollerInstance as controller } from "../Controller/pagePostsController.js";
import multer from "multer";
import { fileValidatorMiddleware } from "../Middleware/FileValidator/fileValidatorMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileValidatorMiddleware,
});
router.get("/myPosts", controller.getMyPosts);
router.post("/add", upload.array("postFile", 10), controller.addPost);
export default router;
