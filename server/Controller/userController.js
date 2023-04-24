import Users from "../Models/Users.js";
import { getData } from "../Utils/Paginator/paginator.js";
import { createArray } from "../Utils/CustomMethods/Objects.js";
import { getUsersOnline } from "../Utils/Socket/GlobalUsers.js";

class UserController {
  async getUserNameByRegex(req, res, next) {
    try {
      const name = req.query.name;
      const page = req.query.page ?? 1;
      const itemsCount = req.query.itemsCount ?? 5;
      if (!name) throw new Error("Not name in your request !");
      const nameRegexp = new RegExp(name, "i");
      const usersInfo = await Users.find(
        { name: nameRegexp },
        { name: 1, username: 1, photoURL: 1 }
      );
      const usersData = getData(usersInfo, page, itemsCount);
      if (!usersData || !usersData.length)
        throw new Error("Users with this name didn't exist ");
      return res
        .status(200)
        .json({ users: usersData, itemsCount: usersInfo.length });
    } catch (e) {
      next(e);
    }
  }

  getUsersOnline(req, res, next) {
    try {
      const onlineUsers = getUsersOnline();
      res.status(200).json(onlineUsers);
    } catch (e) {
      next(e);
    }
  }
}
export const userControler = new UserController();
