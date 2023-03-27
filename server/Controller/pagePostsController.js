import PagePublications from "../Models/PagePublications.js";
import { saveFile } from "../Utils/Files/SaveFile/saveFile.js";
import { getFileType } from "../Utils/Files/GetFileType/getFileType.js";
import { getFriendsAndFollowers } from "../Utils/getDataFromModels/Friends.js";
import { NotificationServiceInstance as NotificationService } from "../Services/notificationService.js";
import Users from "../Models/Users.js";
import Followers from "../Models/Followers.js";
import { getData } from "../Utils/Paginator/paginator.js";

class PagePostsController {
  async getUserPosts(req, res, next) {
    try {
      const username = req.query.username;
      const page = req.query.page || 1;
      const itemsCount = req.query.itemsCount || 5;
      const author = await Users.findOne({ username }, { _id: 1 });
      const data = await PagePublications.find({
        $or: [{ author }],
      });
      const publications = getData(data, page, itemsCount);

      return res.status(200).json({
        status: 200,
        publications,
      });
    } catch (e) {
      next(e);
    }
  }

  async getFollowersPosts(req, res, next) {
    try {
      const user = req.user;
      const page = req.query.page || 1;
      const itemsCount = req.query.itemsCount || 5;
      const { followers } = await Followers.findOne({ user });
      const [followersPublications] = await Promise.all(
        followers?.map((follower) =>
          PagePublications.find({ author: follower })
        )
      );

      followersPublications.sort((a, b) => a.time - b.time);
      const publications = getData(followersPublications, page, itemsCount);
      res.status(200).send(publications);
    } catch (e) {
      next(e);
    }
  }

  async addPost(req, res, next) {
    try {
      const user = req.user;
      const { post } = req.body;
      const files = req.files;
      const filesData = files?.map((file) => ({
        fileURL: saveFile(file),
        type: getFileType(file),
      }));

      const postData = {
        name: post?.name ?? null,
        description: post?.description ?? null,
        time: Date.now(),
        comments: [],
        author: user,
        files: filesData,
      };
      const [data, toUsers, currentUser] = await Promise.all([
        new PagePublications(postData).save(),
        // getFriendsAndFollowers(user),
        // Users.findById(req.user),
      ]);
      // NotificationService.createNotification({
      //   currentUser,
      //   toUsers,
      //   type: "publish",
      // });
      return res.status(200).json({
        status: "SUCCESS",
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const PagePostsControllerInstance = new PagePostsController();
