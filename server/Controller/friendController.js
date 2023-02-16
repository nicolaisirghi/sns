import Friends from "../Models/Friends.js";

class FriendController {
    async getFriends(req, res, next) {
        try {
            const user = req.user;
            if (!user) throw new Error("User not logged!");
            const friends = await Friends.findOne({user}, {_id: 0, user: 0});
            if(!friends) throw new Error('You haven t friends ')
            res.status(200).json({status: "success", friends})
        } catch (e) {
            next(e)
        }
    }

    async addFriend(req, res, next) {
        try {
            const user = req.user;
            if (!user) throw new Error("User not logged!");
            const {newFriend} = req.body
            if(!newFriend) throw new Error('Friend should be in your request !')
            const dataFromDB = await Friends.findOne({user})
            const friendsID = dataFromDB.friends.map(friend=>friend._id.toString())
            if(!dataFromDB){
                await new Friends({user,friends: newFriend}).save();
            }
            else if(!friendsID.includes(newFriend))  {
                console.log("In:",newFriend in friendsID)
                console.log("New friend",newFriend);
                console.log("Friends",friendsID[0]);
                console.log("Equal : ",newFriend===friendsID[0])
                dataFromDB.friends.push(newFriend)
                await dataFromDB.save()
            }
            else {
                throw new Error("User is already in your list of friends !")
            }
            res.status(200).json({
                status:"SUCCESS",
                message:"Friend added with success !"
            })

        } catch (e) {
            next(e)
        }
    }

    async removeFriend(req, res, next) {
        try {
            const user = req.user;
            if (!user) throw new Error('User not logged!')
            const dataFromDB = await Friends.findOne({user})
            if (!dataFromDB) throw new Error('Wrong ID ! ');
            const {oldFriend} = req.body;
            if (!oldFriend) throw new Error('Not friend in request!')
            if (!(dataFromDB.friends.includes(oldFriend))) {
                throw new Error(`This user isn't your friend`);
            }
            Friends.updateOne({user}, {
                    $pull: {friends: oldFriend}
                }
            )
            res.status(200).json({
                status: "SUCCESS",
                message: `User with id ${oldFriend} was removed from friends!`
            })
        } catch (e) {
            next(e)
        }
    }
}
export const FriendControllerInstance = new FriendController()