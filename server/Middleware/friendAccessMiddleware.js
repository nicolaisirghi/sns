import Friends from "../Models/Friends.js";

export const friendAccessMiddleware = async (req, res, next) => {
  try {
    const currentUser = req.user;
    console.log("Current user : ", currentUser);
    const { toUser } = req.body;
    const currentUserFriends = await Friends.findOne({ user: currentUser });
    if (!currentUserFriends) throw new Error("You haven't friends");
    const currentFriendsID = currentUserFriends.friends.map((friend) =>
      friend._id.toString()
    );
    if (!currentFriendsID.includes(toUser)) {
      throw new Error("You can't send message to non-friends");
    }
    next();
  } catch (e) {
    next(e);
  }
};
