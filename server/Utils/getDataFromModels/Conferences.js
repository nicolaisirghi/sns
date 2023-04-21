import Conferences from "../../Models/Conferences.js";
import { getData } from "../Paginator/paginator.js";

export const getDataFromConferences = async (req) => {
  const { page = 1, itemsCount = 5 } = req.query;
  const {filters = null} = req.body;
  let conferencesInfo;
  if (!filters) {
    conferencesInfo = await Conferences.find();
  } else {
    conferencesInfo = await getFilterConference(filters);
  }


  return getData(conferencesInfo,page,itemsCount);
};
const getFilterConference = async (filters) => {
  const { interval = null, author = "", localization="",isOnline=false } = filters;

  const query = {};

  if (author) {
    query.author = author;
  }
  if (localization) {
    query.localization = localization;
  }
  else if(isOnline)
  {
    query.isOnline = isOnline;
  }
  if (interval) {
    if (interval.startDate && interval.endDate) {
      query.time = {
        $gte: interval.startDate,
        $lte: interval.endDate,
      };
    } else if (interval.startDate) {
      query.time = {
        $gte: interval.startDate,
        $lte: new Date(),
      };
    } else if (interval.endDate) {
      query.time = {
        $gte: new Date(0),
        $lte: interval.endDate,
      };
    }
  }

  const conferences = await Conferences.find(query);
  return conferences;
};
