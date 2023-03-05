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
router.get("/byAuthor", controller.getPublicationsByAuthor);
router.get("/byName", controller.getSinglePublication);
router.get("/:category/", controller.getPublications);
export default router;
