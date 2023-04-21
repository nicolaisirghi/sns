import Conferences from "../Models/Conferences.js";
import { getDataFromConferences } from "../Utils/getDataFromModels/Conferences.js";

class ConferenceController {
  async addConference(req, res, next) {
    try {
      const { conferenceInfo } = req.body;
      const author = req.username;
      if (!conferenceInfo) throw new Error("Conference Info can't be empty!");
      const {
        name,
        category,
        time,
        description = "",
        localization = null,
        link = null,
      } = conferenceInfo;
      if (localization) {
        if (link) throw new Error("It's a real time conference !");
        await new Conferences({
          name,
          author,
          category,
          time: new Date(time),
          localization,
          description,
        }).save();
      } else {
        if (!link)
          throw new Error(
            "Link should be in your request because it's an online conference"
          );
        await new Conferences({
          name,
          author,
          category,
          time: new Date(time),
          isOnline:true,
          link,
          description,
        }).save();
      }
      return res.status(200).json({
        status: "SUCCESS",
        message: "Conference created with success",
      });
    } catch (e) {
      next(e);
    }
  }

  async getConference(req, res, next) {
    try {
      const conferenceInfo = await getDataFromConferences(req);
      return res.status(200).json({ conferenceInfo });
    } catch (e) {
      next(e);
    }
  }
  async removeConference(req,res,next)
  {
    try{
      const {conferenceID} = req.body;
      if(!conferenceID) throw new Error("Not conferenceID in your request !");
      const author = req.username;
      const conferenceData = await Conferences.findById(conferenceID);
      if(!conferenceData )
      throw new Error("Conference not found !");
      if(conferenceData.author !== author)
      throw new Error("You can delete only your conferences !");
      await Conferences.deleteOne({_id:conferenceID,author})
      return res.status(200).json({
        status:"SUCCESS",
        message:"Conference deleted with success!"
      })
    }catch(e)
    {
      next(e)
    }
  }
}
export const conferenceController = new ConferenceController();
