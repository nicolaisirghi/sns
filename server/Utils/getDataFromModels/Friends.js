import Friends from "../../Models/Friends.js";
import Followers from "../../Models/Followers.js";

export const getFriendsAndFollowers = async (user) => {
  const [[{ friends }], [{ followers }]] = await Promise.all([
    Friends.find({ user }, { friends: 1 }),
    Followers.find({ user }, { followers: 1 }),
  ]);
  return [...friends, ...followers];
};
