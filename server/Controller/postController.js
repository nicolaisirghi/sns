import Questions from "../Models/Questions.js";
import Answers from "../Models/Answers.js";
import Categories from "../Models/Categories.js";
import { getComments } from "../Utils/getDataFromModels/Posts.js";

class PostsController {
  getCategories = async function (req, res, next) {
    try {
      const categoriesCollection = await Categories.find();
      const categories = categoriesCollection.map((el) => el.Category);
      res.status(200).json({ categories });
    } catch (e) {
      next(e);
    }
  };

  getComments = async function (req, res, next) {
    try {
      const category = req.params.category;
      const itemsCount = req.query.itemsCount || 5;
      const page = req.query.page || 1;
      const { comments, totalItemsCount } = await getComments(
        category,
        page,
        itemsCount
      );
      res.status(200).json({ comments, totalItemsCount, itemsCount });
    } catch (e) {
      next(e);
    }
  };

  addQuestion = async function (req, res, next) {
    try {
      const user = req.username;
      const questionDocument = {
        ...req.body.questionInfo,
        date: new Date(),
        user,
      };
      const category = req.params.category;
      const questionFromCollection = await Questions.findOne({
        question: questionDocument.question,
      });
      if (!questionFromCollection) {
        const newQuestion = await new Questions({
          ...questionDocument,
          category,
        }).save();
        const newComments = await getComments(category);
        global.socketIO.emit("new question", newComments);
        res.status(200).json({
          statusCode: 200,
          message: "Question added with success!",
          data: newQuestion,
        });
      } else {
        throw new Error("This question is already asked!");
      }
    } catch (e) {
      next(e);
    }
  };

  addAnswer = async function (req, res, next) {
    try {
      const user = req.username;
      const { answerInfo } = req.body;
      const questionCandidate = await Questions.findOne({
        _id: answerInfo.answeredTo,
      });
      if (questionCandidate) {
        const answerDocument = { ...answerInfo, date: new Date(), user };
        const newAnswer = await new Answers(answerDocument).save();
        const newComments = await getComments(questionCandidate.category);
        global.socketIO.emit("new answer", newComments);
        res.status(200).json({
          statusCode: 200,
          message: `Answered to question ${questionCandidate.question} with success!`,
          data: newAnswer,
        });
      } else {
        throw new Error("Question not found");
      }
    } catch (e) {
      next(e);
    }
  };

  getCommentsByQuestion = async function (req, res, next) {
    const questionID = req.query.questionID;
    try {
      const question = await Questions.findOne({ _id: questionID });
      if (question) {
        const answers = await Answers.find({ answeredTo: questionID });
        const comment = { questionInfo: question, answerInfo: answers };
        res.status(200).send(comment);
      } else {
        throw new Error("This id not in database");
      }
    } catch (e) {
      next(e);
    }
  };

  deleteQuestion = async function (req, res, next) {
    try {
      const questionID = req.params.questionID;
      if (!questionID) throw new Error("Not question in params");
      const questionCandidate = await Questions.findOne({ _id: questionID });
      if (!questionCandidate) throw new Error("Question not found ");
      if (questionCandidate.user !== req.user.id)
        throw new Error("You don't have permission to remove this question!");
      await Questions.deleteOne(questionCandidate);
      res.status(200).send(`The question ${questionCandidate} was deleted`);
    } catch (e) {
      next(e);
    }
  };

  deleteAnswer = async function (req, res, next) {
    try {
      const answerID = req.params.answerID;
      if (!answerID) throw new Error("Not answer in params");
      const answerCandidate = await Answers.findOne({ _id: answerID });
      if (!answerCandidate) throw new Error("Answer not found ");
      if (answerCandidate.user !== req.user.id)
        throw new Error("You don't have permission to remove this answer!");
      await Answers.deleteOne(answerCandidate);
      res.status(200).send(`The answer ${answerCandidate} was deleted`);
    } catch (e) {
      next(e);
    }
  };

  changeQuestion = async function (req, res, next) {
    try {
      const questionID = req.params.questionID;
      if (!questionID) throw new Error("Not question in params");
      const questionCandidate = await Questions.findOne({ _id: questionID });
      if (!questionCandidate) throw new Error("Question not found ");
      if (questionCandidate.user !== req.user.id)
        throw new Error("You don't have permission to modify this question!");
      const { question, description } = req.body.questionInfo;
      if (!question || !description)
        throw new Error("Missing fields for update!");
      questionCandidate.question = question;
      questionCandidate.description = description;
      await questionCandidate.save();
      res
        .status(400)
        .send(`Question ${questionCandidate} was updated with success!`);
    } catch (e) {
      next(e);
    }
  };

  changeAnswer = async function (req, res, next) {
    try {
      const answerID = req.params.answerID;
      if (!answerID) throw new Error("Not answer in params");
      const answerCandidate = await Answers.findOne({ _id: answerID });
      if (!answerCandidate) throw new Error("answer not found ");
      // if (answerCandidate.user !== req.user.id) throw new Error("You don't have permission to modify this answer!")
      const { answer } = req.body.answerInfo;
      if (!answer) throw new Error("Missing fields for update!");
      answerCandidate.answer = answer;
      await answerCandidate.save();
      res
        .status(400)
        .send(`Answer ${answerCandidate} was updated with success!`);
    } catch (e) {
      next(e);
    }
  };

  createCategories = async function (req, res, next) {
    try {
      const category = req.body.category;
      if (!category) throw new Error("Not category in your request !");
      const categoryCandidate = await Categories.findOne({
        Category: category,
      });
      if (categoryCandidate)
        throw new Error("This category was already created!");
      const newCategory = await new Categories({ Category: category }).save();
      res.status(200).send(newCategory);
    } catch (e) {
      next(e);
    }
  };

  async getQuestionByTitle(req, res, next) {
    try {
      const { title } = req.query;
      if (!title) throw new Error("Title not found in your request ! ");
      const question = title.replace(/_/g, " ").trim();
      const questionCandidate = await Questions.findOne({ question });
      console.log("QUestion Candidate : ", questionCandidate);
      if (!questionCandidate) throw new Error("The question didn't exist ");
      const responeInfo = await Answers.find({
        answeredTo: questionCandidate._id,
      });
      return res
        .status(200)
        .json({ questionInfo: questionCandidate, responeInfo });
    } catch (e) {
      next(e);
    }
  }
}

export const PostsControllerInstance = new PostsController();
