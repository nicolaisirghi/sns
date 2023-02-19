import Groups from "../Models/Groups.js";
class GroupController {
  async getGlobalGroups(req, res, next) {
    try {
      const groupType = req.query.groupType || "all";
      const groups =
        groupType === "all"
          ? await Groups.find()
          : await Groups.find({ type: groupType });
      res.status(200).json({
        status: "Success",
        groups,
      });
    } catch (e) {
      next(e);
    }
  }

  async createGroup(req, res, next) {
    try {
      const { groupName } = req.body.groupData;
      if (!groupName) throw new Error("The group name is empty !");
      const groupCandidate = await Groups.findOne({ groupName });
      if (groupCandidate)
        throw new Error("Group with this name already exist!");
      const type = req.body.groupData.type || "public";
      const creator = req.user;
      const participants = req.user;
      const newGroup = await new Groups({
        groupName,
        type,
        creator,
        participants,
        creationDate: new Date(),
      }).save();
      res.status(200).json({
        status: "Success",
        newGroup,
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteGroups(req, res, next) {
    try {
      const groupID = req.body.groupID;
      const group = await Groups.findOne({ _id: groupID });
      const currentUser = req.user;
      if (!group) throw new Error("Group not found !");
      const { creator } = group;
      const isCreator = currentUser.toString() === creator.toString();
      if (!isCreator)
        throw new Error("You not have permission to delete this group !");
      await Groups.remove(group);
      res.status(200).json({
        status: "Success",
        message: "Group was deleted!",
      });
    } catch (e) {
      next(e);
    }
  }

  async addUser(req, res, next) {
    try {
      const groupID = req.body.groupID;
      const group = await Groups.findOne({ _id: groupID });
      const currentUser = req.user;
      if (!group) throw new Error("Group not found !");
      const { creator, admins, participants } = group;
      const isSatisfiedRole =
        creator.toString() === currentUser.toString() ||
        admins.includes(currentUser);
      if (!isSatisfiedRole)
        throw new Error(
          "You can't add user because your role in group is too low"
        );
      const newParticipant = req.body.newParticipant;
      if (!newParticipant) throw new Error("Please add a participant!");
      const isParticipantInGroup = participants.includes(newParticipant);
      if (isParticipantInGroup)
        throw new Error("The user already is in group !");
      global.socketIO.to(newParticipant).emit("addUserRequest", {
        message: "Became part of oru group",
        groupInfo: group,
      });
      res.status(200).json({
        status: "Success",
      });
    } catch (e) {
      next(e);
    }
  }
}

export const GroupControllerInstance = new GroupController();
