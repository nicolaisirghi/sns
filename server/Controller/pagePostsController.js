import PagePublications from "../Models/PagePublications.js";
import { saveFile } from "../Utils/Files/SaveFile/saveFile.js";
import { getFileType } from "../Utils/Files/GetFileType/getFileType.js";

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
      console.log("Files data : ", filesData);
      const postData = {
        name: post?.name || null,
        description: post?.description || null,
        time: Date.now(),
        comments: [],
        author: user,
        files: filesData,
      };
      const data = await new PagePublications(postData).save();
      return res.status(200).json({
        status: "SUCCESS",
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const PagePostsCotrollerInstance = new PagePostsController();
