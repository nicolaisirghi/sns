import Friends from "../Models/Friends.js";
import Users from "../Models/Users.js";

export const friendAccessMiddleware = async (req, res, next) => {
  try {
    const currentUser = req.username;

    const { toUser } = req.body;
    const [currentUserFriends, friendInfo] = await Promise.all([
      Friends.findOne({ user: currentUser }),
      Users.findOne({ username: toUser }),
    ]);
    const friendUsername = friendInfo.username;
    if (!currentUserFriends) throw new Error("You haven't friends");
    const currentFriends = currentUserFriends.friends;
    if (!currentFriends.includes(friendUsername)) {
      throw new Error("You can't send message to non-friends");
    }
    next();
  } catch (e) {
    next(e);
  }
};
