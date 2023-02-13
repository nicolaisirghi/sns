import Groups from "../Models/Groups.js";
class GroupController {
    async getGroups(req, res, next) {
        try {
            const groupType = req.query.groupType || 'all'
            const groups = groupType === 'all' ? await Groups.find() : await Groups.find({ type:groupType})
            res.status(200).json({
                status:"Success",
                groups
            })
        } catch (e) {
            next(e)
        }
    }
    async createGroups(req, res, next)
    {
        try{
            const {groupName} = req.body.groupData;
            if(!groupName) throw new Error('The group name is empty !')
            const groupCandidate = await  Groups.findOne({groupName})
            if(groupCandidate) throw new Error('Group with this name already exist!')
            const type = req.body.groupData.type || "public"
            const creator = req.user;
            const participants = req.user;
            const newGroup = await new Groups({groupName,type,creator,participants,creationDate:new Date()}).save()
            res.status(200).json({
                status: "Success",
                newGroup
            })
        }
        catch(e){

            next(e)
        }
    }

}
export const GroupControllerInstance = new GroupController()