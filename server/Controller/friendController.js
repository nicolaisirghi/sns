import Friends from "../Models/Friends.js";
import Users from "../Models/Users.js";
import {NotificationServiceInstance as NotificationService} from "../Services/notificationService.js";

class FriendController {
    async getFriends(req, res, next) {
        try {
            const user = req.user;
            const data = await Friends.findOne({user}, {_id: 0, user: 0});
            const {friends} = data;
            const friendsID = friends.map(friend => friend.toString());
            console.log(friendsID)
            const friendsInfo = await Promise.all(
                friends.map(friend => Users.findById(friend,{password: 0})))
            if (!friends) throw new Error("You haven t friends ");
            res.status(200).json({status: "SUCCESS", data: {friends: friendsInfo, itemCount: friendsInfo.length}});
        } catch (e) {
            next(e);
        }
    }

    async requestFriend(req, res, next) {
        try {
            const {requestedFriend} = req.body;
            const userCandidate = Users.findOne({_id: requestedFriend});
            const currentUser = await Users.findOne({_id: req.user});
            if (userCandidate) {
                const {notification, notificationInfo} =
                    NotificationService.createNotification({
                        currentUser,
                        requestedFriend,
                    });
                global.socketIO
                    .to(global.usersOnline[requestedFriend])
                    .emit("requestFriend", {notification});
                res.status(200).json({
                    message: `The request was sent to user ${requestedFriend}`,
                    notificationInfo,
                });
            }
        } catch (e) {
            next(e);
        }
    }

    async addFriend(req, res, next) {
        try {
            const {user} = req;
            const {newFriend} = req.body;

            if (!newFriend) {
                throw new Error("Friend should be in your request!");
            }

            const [currentUserFriends, requestedUserFriends] = await Promise.all([
                Friends.findOne({user}),
                Friends.findOne({user: newFriend}),
            ]);
            if (!currentUserFriends && !requestedUserFriends) {
                await Promise.all([
                    new Friends({user, friends: [newFriend]}).save(),
                    new Friends({user: newFriend, friends: [user]}).save(),
                ]);
            } else if (!currentUserFriends) {
                requestedUserFriends.friends.push(user);
                await requestedUserFriends.save();
                await new Friends({user, friends: [newFriend]}).save();
            } else if (!requestedUserFriends) {
                currentUserFriends.friends.push(newFriend);
                await currentUserFriends.save();
                await new Friends({user: newFriend, friends: [user]}).save();
            } else {
                const currentFriendsID = currentUserFriends.friends.map((friend) =>
                    friend._id.toString()
                );
                if (currentFriendsID.includes(newFriend)) {
                    throw new Error("User is already in your list of friends!");
                }
                currentUserFriends.friends.push(newFriend);
                await currentUserFriends.save();
                requestedUserFriends.friends.push(user);
                await requestedUserFriends.save();
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
            const user = req.user;
            const dataFromDB = await Friends.findOne({user});
            if (!dataFromDB) throw new Error("Wrong ID ! ");
            const {oldFriend} = req.body;
            if (!oldFriend) throw new Error("Not friend in request!");
            if (!dataFromDB.friends.includes(oldFriend)) {
                throw new Error("This user isn't your friend");
            }
            await Friends.updateOne(
                {user},
                {
                    $pull: {friends: oldFriend},
                }
            );
            res.status(200).json({
                status: "SUCCESS",
                message: `User with id ${oldFriend} was removed from friends!`,
            });
        } catch (e) {
            next(e);
        }
    }
}

export const FriendControllerInstance = new FriendController();
