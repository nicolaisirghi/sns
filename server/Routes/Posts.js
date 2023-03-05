import express from "express";
import { PostsControllerInstance as controller } from "../Controller/postController.js";

const router = express.Router();
router.post("/", controller.createCategories);
router.get("/", controller.getCategories);
router.get("/:category", controller.getComments);
router.post("/:category/addQuestion", controller.addQuestion);
router.delete(
  "/:category/deleteQuestion/:questionID",
  controller.deleteQuestion
);
router.delete(
  "/:category/deleteAnswer/:answerID",
  controller.deleteAnswer
);
router.put(
  "/:category/changeQuestion/:questionID",
  controller.changeQuestion
);
router.put("/:category/changeAnswer/:answerID", controller.changeAnswer);
router.post("/:category/addAnswer", controller.addAnswer);
router.get("/:category/getQuestionByTitle", controller.getQuestionByTitle);
export default router;
