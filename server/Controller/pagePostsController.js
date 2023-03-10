import PagePublications from "../Models/PagePublications.js";
import { saveFile } from "../Utils/Files/SaveFile/saveFile.js";
import { getFileType } from "../Utils/Files/GetFileType/getFileType.js";
import { getFriendsAndFollowers } from "../Utils/getDataFromModels/Friends.js";
import { NotificationServiceInstance as NotificationService } from "../Services/notificationService.js";
import Users from "../Models/Users.js";

class PagePostsController {
  async getMyPosts(req, res, next) {
    try {
      const user = req.user;
      const data = await PagePublications.find({ author: user });
      return res.status(200).json({
        status: 200,
        data,
      });
    } catch (e) {
      next(e);
    }
  }

  async addPost(req, res, next) {
    try {
      const user = req.user;
      const { post } = req.body;
      const files = req.files;
      const filesData = files.map((file) => ({
        fileURL: saveFile(file),
        type: getFileType(file),
      }));

      const postData = {
        name: post?.name || null,
        description: post?.description || null,
        time: Date.now(),
        comments: [],
        author: user,
        files: filesData,
      };
      const [data, toUsers, currentUser] = await Promise.all([
        new PagePublications(postData).save(),
        getFriendsAndFollowers(user),
        Users.findById(req.user),
      ]);
      NotificationService.createNotification({
        currentUser,
        toUsers,
        type: "publish",
      });
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
