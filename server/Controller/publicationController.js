import Publications from "../Models/Publications.js";
import { saveFile } from "../Utils/Files/SaveFile/saveFile.js";
import { getFileType } from "../Utils/Files/GetFileType/getFileType.js";
import PagePublications from "../Models/PagePublications.js";
import { getLikes } from "../Utils/getDataFromModels/Publications.js";
import Users from "../Models/Users.js";
import PageComments from "../Models/PageComments.js";

class PublicationsController {
  constructor() {
    this.checkLikes = this.checkLikes.bind(this);
    this.removeLike = this.removeLike.bind(this);
    this.addLike = this.addLike.bind(this);
  }
  getPublications = async function (req, res, next) {
    try {
      const category = req.params.category;
      const publications = await Publications.find({ category });
      res.status(200).json({ publications });
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
        console.log("Author : ", author);
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
  getPublicationsByAuthor = async function (req, res, next) {
    try {
      const { author } = req.body;
      const publications = await Publications.find({ author });
      res.status(200).json({ status: "SUCCESS", publications });
    } catch (e) {
      next(e);
    }
  };

  getSinglePublication = async function (req, res, next) {
    try {
      const { publicationID } = req.query;
      const [simplePublication, pagePublication] = await Promise.all([
        Publications.findById(publicationID),
        PagePublications.findById(publicationID),
      ]);

      const publication = simplePublication ?? pagePublication;
      if (!publication) throw new Error("Not publication !");

      const publicationData = await getLikes(publication);
      res.status(200).json({ status: "SUCCESS", publicationData });
    } catch (e) {
      next(e);
    }
  };

  addLike = async function (req, res, next) {
    try {
      const user = req.user;
      const { isLikedByUser, publication } = await this.checkLikes(
        req,
        res,
        next
      );
      if (isLikedByUser) throw new Error("You already have liked this post !");
      publication.likes.push({
        user,
        date: new Date(),
      });
      await publication.save();
      res.status(200).json({ status: "Success" });
    } catch (e) {
      next(e);
    }
  };
  checkLikes = async function (req, res, next) {
    try {
      const user = req.user;
      const { postID } = req.body;
      const [simplePublication, pagePublication] = await Promise.all([
        Publications.findById(postID),
        PagePublications.findById(postID),
      ]);
      const publication = simplePublication ?? pagePublication;
      if (!publication)
        throw new Error("You need to select a publication to add like!");
      const isLikedByUser = publication.likes.find(
        (candidate) => candidate.user.toString() === user.toString()
      );
      return { isLikedByUser, publication };
    } catch (e) {
      next(e);
    }
  };
  removeLike = async function (req, res, next) {
    try {
      const user = req.user;
      const { isLikedByUser, publication } = await this.checkLikes(
        req,
        res,
        next
      );
      if (!isLikedByUser) throw new Error("You  haven't  liked this post !");

      await publication.likes.pull({ user });

      await publication.save();
      res.status(200).json({ status: "Success" });
    } catch (e) {
      next(e);
    }
  };
  addPublication = async function (req, res, next) {
    try {
      const files = req.files;
      const { username = "" } = await Users.findById(req.user);
      const publication = {
        ...req.body.publication,
        category: req.params.category,
        author: username,
        date: new Date(),
        filesData: files
          ? files.map((file) => ({
              fileURL: saveFile(file),
              type: getFileType(file),
            }))
          : null,
      };
      const savedPublication = await new Publications(publication).save();
      res.status(200).json({ message: "Success", data: savedPublication });
    } catch (e) {
      next(e);
    }
  };
}

export const PublicationsControllerInstance = new PublicationsController();
