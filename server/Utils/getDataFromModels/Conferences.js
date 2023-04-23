import Conferences from "../../Models/Conferences.js";
import { getData } from "../Paginator/paginator.js";
import { createFilterQuery } from "../Filters/filters.js";

export const getDataFromConferences = async (req) => {
  const { page = 1, itemsCount = 5 } = req.query;
  const { filters = null } = req.body;
  let conferencesInfo;
  if (!filters) {
    conferencesInfo = await Conferences.find();
  } else {
    const query = createFilterQuery(filters);
    conferencesInfo = await Conferences.find(query);
  }
  return getData(conferencesInfo, page, itemsCount);
};
