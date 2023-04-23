import Friends from "../Models/Friends.js";
import Users from "../Models/Users.js";

export const friendAccessMiddleware = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const { toUser } = req.body;
    const [currentUserFriends, friendInfo] = await Promise.all([
      Friends.findOne({ user: currentUser }),
      Users.findOne({ username: toUser }),
    ]);
    const friendID = friendInfo._id.toString();
    if (!currentUserFriends) throw new Error("You haven't friends");
    const currentFriendsID = currentUserFriends.friends.map((friend) =>
      friend._id.toString()
    );
    if (!currentFriendsID.includes(friendID)) {
      throw new Error("You can't send message to non-friends");
    }
    next();
  } catch (e) {
    next(e);
  }
};
