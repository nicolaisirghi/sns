import Questions from "../../Models/Questions.js";
import Users from "../../Models/Users.js";
import Answers from "../../Models/Answers.js";

export const getComments = async (category, page = 1, itemsCount = 5) => {
  const questions = await Questions.find({ category }, { _v: 0 });
  const questionIds = questions.map((question) => question._id);
  const [answers, users, allUsers] = await Promise.all([
    Answers.find({ answeredTo: { $in: questionIds } }),
    Users.find(
      { _id: { $in: questions.map((question) => question.user) } },
      { email: 0, password: 0 }
    ),
    Users.find({}, { email: 0, password: 0 }),
  ]);

  const comments = questions.map((question) => {
    const answerInfo = answers.filter((answer) => {
      return answer.answeredTo.toString() === question._id.toString();
    });
    const userInfo = users.find(
      (user) => user._id.toString() === question.user.toString()
    );
    return {
      questionInfo: question,
      answerInfo,
      userInfo,
    };
  });

  const itemsFromCollectionSize = comments.length;
  const totalPages = Math.ceil(itemsFromCollectionSize / itemsCount);

  const newArr =
    page <= totalPages
      ? comments.slice((page - 1) * itemsCount, page * itemsCount)
      : comments.slice((totalPages - 1) * itemsCount);

  const data = newArr.map((comment) => {
    return Object.assign(comment, {
      answerInfo: Object.assign(
        comment.answerInfo,
        comment.answerInfo.map((answer) => {
          const userAnswered = allUsers.find((user) => {
            return user._id.toString() === answer.user.toString();
          });
          return Object.assign(answer, { user: userAnswered });
        })
      ),
    });
  });

  return {
    comments: data,
    totalItemsCount: itemsFromCollectionSize,
    itemsCount,
  };
};
