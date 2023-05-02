export const createFilterQuery = (filters) => {
  const { time = null, date = null } = filters;
  let query = {};

  if (time) {
    if (time.startDate && time.endDate) {
      query.time = {
        $gte: time.startDate,
        $lte: time.endDate,
      };
    } else if (time.startDate) {
      query.time = {
        $gte: time.startDate,
        $lte: new Date(),
      };
    } else if (time.endDate) {
      query.time = {
        $gte: new Date(0),
        $lte: time.endDate,
      };
    }
  }

  return { ...filters, ...query };
};
