import Messages from "../Models/SimpleMessages.js";
import Users from "../Models/Users.js";

class MessageController {
  async addMessage(req, res, next) {
    try {
      const { toUser, message } = req.body;
      if (!toUser) throw new Error("Please select whom send the message!");
      if (!message) throw new Error("The message can't be empty!");
      const Message = await new Messages({
        message,
        date: new Date(),
        to: toUser,
        from: req.username,
      }).save();
      global.socketIO
        .to(global.globalUsers[toUser])
        .emit("private message", Message);
      res.status(200).json({
        message: "Success",
        data: Message,
      });
    } catch (e) {
      next(e);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { toUser } = req.params;
      const currentUser = req.username;
      if (!toUser) throw new Error("Please select whom send the message!");
      const conversation = await Messages.find({
        $or: [
          { to: toUser, from: currentUser },
          { to: currentUser, from: toUser },
        ],
      });
      if (!conversation.length)
        throw new Error("Not conversation between this 2 users!");
      res.status(200).json(conversation);
    } catch (e) {
      next(e);
    }
  }

  async getChats(req, res, next) {
    try {
      const currentUser = req.username;
      const chats = await Messages.find(
        { $or: [{ from: currentUser }, { to: currentUser }] },
        { _id: 0 }
      );
      const idParticipants = chats
        .map((message) => message.to)
        .filter((id) => id !== currentUser);
      const users = await Users.find({ username: { $in: idParticipants } });
      const speakers = users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        photoURL: user.photoURL,
      }));
      if (!speakers.length) throw new Error("Chats not found !");
      res.status(200).json(speakers);
    } catch (e) {
      next(e);
    }
  }
}

export const messageControllerInstance = new MessageController();
