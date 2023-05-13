import {
  checkLikes,
  getCommentsInfo,
  getPublicationData,
} from "../Utils/getDataFromModels/Publications.js";
import Publications from "../Models/Publications.js";
import PagePublications from "../Models/PagePublications.js";
import PageComments from "../Models/PageComments.js";
import Questions from "../Models/Questions.js";
import Answers from "../Models/Answers.js";
import PageAnswers from "../Models/PageAnswers.js";

class CommentController {
  getCommentsByID = async function (req, res, next) {
    try {
      const { commentsID } = await getPublicationData(req);
      const commentsInfo = await getCommentsInfo(commentsID);
      return res.status(200).json(commentsInfo);
    } catch (e) {
      next(e);
    }
  };
  addComment = async function (req, res, next) {
    try {
      const { commentInfo } = req.body;
      if (!commentInfo) throw new Error("You must to send commentInfo");
      {
        const { text, commentedTo } = commentInfo;
        if (!text) throw new Error("The comment text is required !");
        if (!commentedTo)
          throw new Error("The commentedTo field is required !");

        const [publicationCandidate, pagePublicationCandidate] =
          await Promise.all([
            Publications.findById(commentedTo),
            PagePublications.findById(commentedTo),
          ]);

        const publicationData =
          publicationCandidate ?? pagePublicationCandidate;
        if (!publicationData) throw new Error("This publication didn't exist");
        const author = req.username;
        const newComment = await new PageComments({ text, author }).save();
        publicationData.comments.push(newComment._id);
        await publicationData.save();
        return res
          .status(200)
          .json({ status: "SUCCES", message: "The comment was send !" });
      }
    } catch (e) {
      next(e);
    }
  };

  addLike = async function (req, res, next) {
    try {
      const { isLikedByUser, publication } = await checkLikes(req);
      if (isLikedByUser) throw new Error("You already have liked this post !");
      publication.likes.push({ user: req.username });
      await publication.save();
      res.status(200).json({
        status: "SUCCESS",
        message: "This comment was liked with success",
      });
    } catch (e) {
      next(e);
    }
  };

  addAnswer = async function (req, res, next) {
    try {
      const { answerInfo } = req.body;
      const { replyTo = null } = answerInfo;
      const { answer, answeredTo } = answerInfo;
      if (!answer || !answeredTo)
        throw new Error("Required fields : answer and anweredTo !");

      const commentCandidate = await PageComments.findById(answeredTo);
      if (replyTo) {
        const answerCandidate = await PageAnswers.findById(replyTo);
        if (!answerCandidate)
          throw new Error(
            "You can't reply to this answer, becuase it not found !"
          );
      }
      if (!commentCandidate) throw new Error("Comment not found ! ");
      const answerData = await new PageAnswers({
        user: req.username,
        answer,
        ...(replyTo && { replyTo }),
      }).save();
      commentCandidate.answers.push(answerData._id);
      await commentCandidate.save();

      return res.status(200).json({
        status: "SUCCESS",
        message: "Answer was uploaded with success!",
      });
    } catch (e) {
      next(e);
    }
  };
}

export const CommentControllerInstance = new CommentController();
