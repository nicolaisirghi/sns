import express from "express";
import { PagePostsControllerInstance as controller } from "../Controller/pagePostsController.js";
import multer from "multer";
import { fileValidatorMiddleware } from "../Middleware/FileValidator/fileValidatorMiddleware.js";
import { accessMiddleware } from "../Middleware/accessMiddleware.js";
import { PublicationsControllerInstance as publicationController } from "../Controller/publicationController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileValidatorMiddleware,
});
router.get("/userPosts", controller.getUserPosts);
router.get("/followersPosts", controller.getFollowersPosts);
router.post("/add", upload.array("postFile", 10), controller.addPost);
router.post("/addLike", accessMiddleware, publicationController.addLike);
router.delete(
  "/removeLike",
  accessMiddleware,
  publicationController.removeLike
);

export default router;
