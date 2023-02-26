import express from "express";
import {PublicationsControllerInstance as publicationsController} from "../Controller/publicationController.js";
import multer from "multer";
import {accessMiddleware} from "../Middleware/accessMiddleware.js";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});
router.get("/:category/", publicationsController.getPublications);
router.post(
    "/:category/addPublication", upload.single('file'),accessMiddleware
    , publicationsController.addPublication
);
router.get("/:category/getSinglePublication", publicationsController.getSinglePublication);
export default router;
