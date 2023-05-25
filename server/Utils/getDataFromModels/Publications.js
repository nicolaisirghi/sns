import Users from "../../Models/Users.js";
import PageComments from "../../Models/PageComments.js";
import Publications from "../../Models/Publications.js";
import PagePublications from "../../Models/PagePublications.js";
import PageAnswers from "../../Models/PageAnswers.js";
import Conferences from "../../Models/Conferences.js";

export const getLikes = async (publications) => {
  const usersInfo = await Promise.all(
    publications.likes.map((like) =>
      Users.findById(like.user, { username: 1, photoURL: 1, name: 1 })
    )
  );
  const likesData = publications.likes.map((like, index) => ({
    date: like.date,
    user: usersInfo[index],
  }));

  return Object.assign(publications, { likes: likesData });
};

export const getCommentsInfo = async (commentsID) => {
  const commentsInfo = await Promise.all(
    commentsID.map((comment) => PageComments.findById(comment))
  );

  const commentsData = await Promise.all(
    commentsInfo.map(async (comment) => {
      const answers = await Promise.all(
        comment.answers.map(async (answer) => {
          const pageAnswer = await PageAnswers.findById(answer);
          return pageAnswer.toObject();
        })
      );
      const commentData = comment.toObject();
      return { comment: { ...commentData, answers } };
    })
  );

  return commentsData;
};
export const getPublicationData = async (req) => {
  const { publicationID } = req.query;
  const [simplePublication, pagePublication] = await Promise.all([
    Publications.findById(publicationID),
    PagePublications.findById(publicationID),
  ]);
  const publication = simplePublication ?? pagePublication;

  if (!publication) throw new Error("Not publication !");

  const commentsID = publication.comments.map((comment) => comment);
  return { publication, commentsID };
};

export const checkLikes = async (req) => {
  const user = req.username;
  const postID = req.query.postID ?? req.body.postID;
  const [simplePublication, pagePublication, pageComment, pageAnswer] =
    await Promise.all([
      Publications.findById(postID),
      PagePublications.findById(postID),
      PageComments.findById(postID),
      PageAnswers.findById(postID),
    ]);
  const publication =
    simplePublication ?? pagePublication ?? pageComment ?? pageAnswer;
  if (!publication)
    throw new Error("You need to select a publication to add like!");
  console.log("User : ", user);
  const isLikedByUser = publication.likes.find(
    (candidate) => candidate.user === user
  );
  return { isLikedByUser, publication };
};
