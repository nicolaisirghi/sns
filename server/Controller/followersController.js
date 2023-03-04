import Users from "../Models/Users.js";
import Followers from "../Models/Followers.js";

class FollowerController {
    async getFollowers(req, res, next) {
        try {
            const user = req.user;
            const data = await Followers.findOne({user});
            if (!data) throw new Error("Error")
            const {followers} = data;
            if (!followers) throw new Error("You haven t followers ");
            const followersInfo = await Promise.all(
                followers.map(follower => Users.findById(follower, {password: 0})))
            res.status(200).json({
                status: "SUCCESS",
                data: {followers: followersInfo, itemCount: followersInfo.length}
            });
        } catch (e) {
            next(e);
        }
    }

    async followUser(req, res, next) {
        try {
            const user = req.user;
            const {followingUser} = req.body;
            if (!followingUser) throw new Error("You need to select who you want to follow")
            const userCandidate = await Followers.findOne({user});
            let data;
            if (!userCandidate) {
                data = await new Followers({user, followPeople: followingUser}).save();
            } else {
                if (userCandidate.followPeople.includes(followingUser)) throw new Error("You already follow this person !")
                userCandidate.followPeople.push(followingUser);
                data = await userCandidate.save();
            }
            return res.status(200).json({
                message: "SUCCESS",
                data
            })

        } catch (e) {
            next(e);
        }
    }


}

export const FollowerControllerInstance = new FollowerController();
