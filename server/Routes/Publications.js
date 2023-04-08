import express from "express";
import { PublicationsControllerInstance as controller } from "../Controller/publicationController.js";
import multer from "multer";
import { accessMiddleware } from "../Middleware/accessMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post(
  "/:category/addPublication",
  upload.array("file", 5),
  accessMiddleware,
  controller.addPublication
);
router.post("/addLike", accessMiddleware, controller.addLike);
router.post("/addComment", accessMiddleware, controller.addComment);
router.delete("/removeLike", accessMiddleware, controller.removeLike);
router.get("/byAuthor", controller.getPublicationsByAuthor);
router.get("/getByID", controller.getSinglePublication);
router.get("/:category/", controller.getPublications);
export default router;
