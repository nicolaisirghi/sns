import Publications from "../Models/Publications.js";
import { saveFile } from "../Utils/Files/SaveFile/saveFile.js";
import { getFileType } from "../Utils/Files/GetFileType/getFileType.js";
import PagePublications from "../Models/PagePublications.js";
import {
  checkLikes,
  getCommentsInfo,
  getLikes,
  getPublicationData,
} from "../Utils/getDataFromModels/Publications.js";
import Users from "../Models/Users.js";
import PageComments from "../Models/PageComments.js";

class PublicationsController {
  getPublications = async function (req, res, next) {
    try {
      const category = req.params.category;
      const publications = await Publications.find({ category });
      res.status(200).json({ publications });
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
      const { publication, commentsID } = await getPublicationData(req);
      const commentsInfo = await getCommentsInfo(commentsID);
      const publicationData = await getLikes(publication);

      res.status(200).json({
        status: "SUCCESS",
        publicationData: {
          ...publicationData.toObject(),
          comments: commentsInfo,
        },
      });
    } catch (e) {
      next(e);
    }
  };

  addLike = async function (req, res, next) {
    try {
      const user = req.user;
      const { isLikedByUser, publication } = await checkLikes(req);
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

  removeLike = async function (req, res, next) {
    try {
      const user = req.user;
      const { isLikedByUser, publication } = await checkLikes(req);
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
