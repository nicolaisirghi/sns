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
      const username = req.query.username ?? req.username;
      const page = req.query.page || 1;
      const itemsCount = req.query.itemsCount || 5;
      const data = await PagePublications.find({ author: username });
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
    // try {
    const user = req.username;
    const page = req.query.page || 1;
    const itemsCount = req.query.itemsCount || 5;
    const followersInfo = await Followers.findOne({ user });
    if (!followersInfo) throw new Error("You haven't followers");

    const { followPeople } = followersInfo;
    const followersUsername = await Promise.all(
      followPeople?.map((follower) => Users.findOne({ username: follower }))
    );

    const [followersPublications] = await Promise.all(
      followersUsername?.map((data) => {
        console.log("Data username : ", data.username);
        return PagePublications.find({ author: data.username });
      })
    );
    followersPublications?.sort((a, b) => a.time - b.time);
    const publications = getData(followersPublications, page, itemsCount);
    res.status(200).send(publications);
    // } catch (e) {
    //   next(e);
    // }
  }

  async addPost(req, res, next) {
    try {
      const userName = req.username;
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
        author: userName,
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
