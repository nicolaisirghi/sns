import Users from "../Models/Users.js";

class SettingController {
  async changeName(req, res, next) {
    try {
      const currentUser = req.user;
      const { name } = req.body;
      const user = await Users.findOne({ _id: currentUser }, { password: 0 });
      user.name = name;
      const changedUser = await user.save();

      res
        .status(200)
        .json({ message: "The user name was changed !", data: changedUser });
    } catch (e) {
      next(e);
    }
  }

  async changePhoto(req, res, next) {
    try {
      const currentUser = req.user;
      const { photo } = req.body;
      const user = await Users.findOne({ _id: currentUser }, { password: 0 });
      user.photoURL = photo;
      const changedUser = await user.save();
      res
        .status(200)
        .json({ message: "The user photo was changed !", data: changedUser });
    } catch (e) {
      next(e);
    }
  }

  async changeEducation(req, res, next) {
    try {
      const currentUser = req.user;
      const { education } = req.body;
      const user = await Users.findOne({ _id: currentUser }, { password: 0 });
      user.education = education;
      const changedUser = await user.save();

      res.status(200).json({
        message: "The user education was changed !",
        data: changedUser,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const SettingControllerInstance = new SettingController();
