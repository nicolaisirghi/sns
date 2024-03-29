import Friends from "../Models/Friends.js";
import Users from "../Models/Users.js";
import { NotificationServiceInstance as NotificationService } from "../Services/notificationService.js";
import RequestedFriends from "../Models/RequestedFriends.js";
import Followers from "../Models/Followers.js";

class FriendController {
  async getFriends(req, res, next) {
    try {
      const user = req.query.username ?? req.username;
      const data = await Friends.findOne({ user }, { _id: 0, user: 0 });
      const { friends } = data;
      const friendsInfo = await Promise.all(
        friends.map((friend) =>
          Users.findOne({ username: friend }, { _id: 0, password: 0 })
        )
      );
      if (!friends) throw new Error("You haven t friends ");
      res.status(200).json({
        status: "SUCCESS",
        data: { friends: friendsInfo, itemCount: friendsInfo.length },
      });
    } catch (e) {
      next(e);
    }
  }

  async requestFriend(req, res, next) {
    try {
      const { requestedFriend } = req.body;
      const userCandidate = await Users.findOne({ username: requestedFriend });
      if (!userCandidate)
        throw new Error("Error, this person didn't exist in database !");

      const [currentUser, { friends }, checkRequest] = await Promise.all([
        Users.findOne({ username: req.username }),
        Friends.findOne({ user: req.username }),
        RequestedFriends.findOne({ user: req.username }),
      ]);

      if (friends.includes(requestedFriend))
        throw new Error("User already in your list of friends !");

      const requestedFriends = checkRequest?.requestedFriends;

      if (!requestedFriends || !requestedFriends.length) {
        await new RequestedFriends({
          user: req.username,
          requestedFriends: [requestedFriend],
        }).save();
        NotificationService.createNotification({
          currentUser,
          toUsers: [requestedFriend],
          type: "request",
        });

        return res.status(200).json({
          message: `The request was sent to user ${requestedFriend}`,
        });
      }

      if (requestedFriends.includes(requestedFriend)) {
        throw new Error("You already have send a request to this user !");
      }
      checkRequest.requestedFriends.push(requestedFriend);
      await checkRequest.save();

      NotificationService.createNotification({
        currentUser,
        toUsers: [requestedFriend],
        type: "request",
      });

      res.status(200).json({
        message: `The request was sent to user ${requestedFriend}`,
      });
    } catch (e) {
      next(e);
    }
  }

  async addFriend(req, res, next) {
    try {
      const user = req.username;
      const { newFriend } = req.body;

      if (!newFriend) {
        throw new Error("Friend should be in your request!");
      }

      const [currentUserFriends, requestedUserFriends] = await Promise.all([
        Friends.findOne({ user }),
        Friends.findOne({ user: newFriend }),
      ]);
      if (!currentUserFriends && !requestedUserFriends) {
        await Promise.all([
          new Friends({ user, friends: [newFriend] }).save(),
          new Friends({
            user: newFriend,
            friends: [user],
          }).save(),
        ]);
      } else if (!currentUserFriends) {
        requestedUserFriends.friends.push(user);
        await requestedUserFriends.save();
        await new Friends({ user, friends: [newFriend] }).save();
      } else if (!requestedUserFriends) {
        currentUserFriends.friends.push(newFriend);
        await currentUserFriends.save();
        await new Friends({ user: newFriend, friends: [user] }).save();
      } else {
        const currentFriendsID = currentUserFriends.friends;
        if (currentFriendsID.includes(newFriend)) {
          throw new Error("User is already in your list of friends!");
        }
        currentUserFriends.friends.push(newFriend);
        await currentUserFriends.save();
        requestedUserFriends.friends.push(user);
        await requestedUserFriends.save();
      }
      const [userFollowers, friendFollowers] = await Promise.all([
        Followers.findOne({ user }),
        Followers.findOne({ user: newFriend }),
      ]);
      if (!userFollowers.followers.includes(newFriend)) {
        userFollowers.followers.push(newFriend);
        userFollowers.save();
      }
      if (!friendFollowers.followers.includes(user)) {
        friendFollowers.followers.push(newFriend);
        friendFollowers.save();
      }
      res.status(200).json({
        status: "SUCCESS",
        message: "Friend added with success !",
      });
    } catch (e) {
      next(e);
    }
  }

  async removeFriend(req, res, next) {
    try {
      const user = req.username;
      const dataFromDB = await Friends.findOne({ user });
      if (!dataFromDB) throw new Error("Wrong ID ! ");
      const { oldFriend } = req.body;
      if (!oldFriend) throw new Error("Not friend in request!");
      if (!dataFromDB.friends.includes(oldFriend)) {
        throw new Error("This user isn't your friend");
      }
      await Promise.all([
        Friends.updateOne(
          { user },
          {
            $pull: { friends: oldFriend },
          }
        ),
        Friends.updateOne(
          { user: oldFriend },
          {
            $pull: { friends: user },
          }
        ),
      ]);
      res.status(200).json({
        status: "SUCCESS",
        message: `User with username ${oldFriend} was removed from friends!`,
      });
    } catch (e) {
      next(e);
    }
  }
  async checkFriend(req, res, next) {
    try {
      const { friendUserName } = req.query;
      const currentUser = req.username;
      const data = await Friends.findOne(
        { user: currentUser },
        { _id: 0, user: 0 }
      );
      if (!data) throw new Error("You haven't friends");
      const { friends } = data;

      const isFriend = friends.includes(friendUserName);
      return res.status(200).json({
        statusCode: 200,
        isFriend,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const FriendControllerInstance = new FriendController();
