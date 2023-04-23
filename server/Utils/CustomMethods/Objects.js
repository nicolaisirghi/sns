export const getLength = (object = {}) => {
  return Object.keys(object).length;
};
export const createArray = (object = {}) => {
  return Object.keys(object).map((key) => ({ [key]: object[key] }));
};
