import Users from "../Models/Users.js";
import Followers from "../Models/Followers.js";
import { NotificationServiceInstance as NotificationService } from "../Services/notificationService.js";
import Friends from "../Models/Friends.js";

class FollowerController {
  async getFollowedByMe(req, res, next) {
    try {
      const user = req.username;
      const followers = await Followers.findOne({ user });
      const { followPeople } = followers;
      if (!followPeople || !followPeople.length)
        throw new Error("You haven t followers ");
      const followersInfo = await Promise.all(
        followPeople.map((follower) =>
          Users.findOne({ username: follower }, { _id: 0, password: 0 })
        )
      );
      res.status(200).json({
        status: "SUCCESS",
        data: { followers: followersInfo, itemCount: followersInfo.length },
      });
    } catch (e) {
      next(e);
    }
  }

  async getFollowers(req, res, next) {
    try {
      const user = req.username;
      const followersData = await Followers.findOne({ user });
      if (!followersData) throw new Error("You haven't followers");

      const { followers } = followersData;
      if (!followers || !followers.length)
        throw new Error("You haven t followers ");
      const followersInfo = await Promise.all(
        followers.map((follower) =>
          Users.find({ username: follower }, { _id: 0, password: 0 })
        )
      );
      res.status(200).json({
        status: "SUCCESS",
        data: { followers: followersInfo, itemCount: followersInfo.length },
      });
    } catch (e) {
      next(e);
    }
  }

  async followUser(req, res, next) {
    try {
      const user = req.username;
      const { followingUser } = req.body;
      if (!followingUser)
        throw new Error("You need to select who you want to follow");
      const [userCandidate, currentUser] = await Promise.all([
        Followers.findOne({ user }),
        Users.findOne({ username: user }),
      ]);
      let data;
      if (!userCandidate) {
        data = await new Followers({
          user,
          followPeople: followingUser,
        }).save();
      } else {
        if (userCandidate.followPeople.includes(followingUser))
          throw new Error("You already follow this person !");
        userCandidate.followPeople.push(followingUser);
        data = await userCandidate.save();
      }
      NotificationService.createNotification({
        currentUser,
        toUsers: [followingUser],
        type: "following",
      });
      return res.status(200).json({
        message: "SUCCESS",
        data,
      });
    } catch (e) {
      next(e);
    }
  }

  async unFollowUser(req, res, next) {
    try {
      const user = req.username;
      const { unFollowingUser } = req.body;
      if (!unFollowingUser)
        throw new Error("You need to select who you want to unfollow!");
      const { followPeople = null } = await Followers.findOne({ user });
      if (!followPeople || !followPeople.includes(unFollowingUser))
        throw new Error("You didn't follow this person !");
      await Followers.updateOne(
        { user },
        {
          $pull: { followPeople: unFollowingUser },
        }
      );
      res.status(200).json({
        status: "SUCCESS",
        message: "User unfollowed!",
      });
    } catch (e) {
      next(e);
    }
  }

  async checkFollower(req, res, next) {
    try {
      const { followerUserName } = req.query;
      const user = req.username;
      const followersData = await Followers.findOne({ user });
      if (!followersData) throw new Error("You haven't followers");

      const { followers } = followersData;

      const isFollower = followers.includes(followerUserName);
      res.status(200).json({
        statusCode: 200,
        isFollower,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const FollowerControllerInstance = new FollowerController();
