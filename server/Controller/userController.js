import Users from "../Models/Users.js";

class UserController {
  async getUserNameByRegex(req, res, next) {
    try {
      const name = req.query.name;
      if (!name) throw new Error("Not name in your request !");
      const nameRegexp = new RegExp(name, "i");
      const usersCandidate = await Users.find(
        { name: nameRegexp },
        { name: 1, username: 1 }
      );
      if (!usersCandidate || !usersCandidate.length)
        throw new Error("Users with this name didn't exist ");
      return res
        .status(200)
        .json({ users: usersCandidate, itemsCount: usersCandidate.length });
    } catch (e) {
      next(e);
    }
  }
}

export const userControler = new UserController();
