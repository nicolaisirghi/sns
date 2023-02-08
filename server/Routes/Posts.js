import express from "express"
import { PostsControllerInstance as postsController } from "../Controller/Posts.js"
import { PublicationsControllerInstance as publicationsController } from "../Controller/Publications.js"

export const router = express.Router()
router.post("/", postsController.createCategories)
router.get("/", postsController.getCategories)
router.get("/:category", postsController.getQuestions)
router.get("/:category/publications", publicationsController.getPublications)
router.post("/:category/publications/addPublication", publicationsController.addPublication)
router.post("/:category/addQuestion", postsController.addQuestion)
router.delete("/:category/deleteQuestion/:questionID", postsController.deleteQuestion)
router.delete("/:category/deleteAnswer/:answerID", postsController.deleteAnswer)
router.put("/:category/changeQuestion/:questionID", postsController.changeQuestion)
router.put("/:category/changeAnswer/:answerID", postsController.changeAnswer)
router.post("/:category/addAnswer", postsController.addAnswer)

// export const postRouter = router;