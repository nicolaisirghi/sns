export const getLength = (object = {}) => {
  return Object.keys(object).length;
};
export const createArray = (object = {}) => {
  return Object.keys(object).map((key) => ({ [key]: object[key] }));
};

export const changeKey = (object = {}, key, newKey) => {
  let newObj = {};
  for (const iterator in object) {
    if (key === iterator) {
      newObj[newKey] = object[key];
    } else {
      newObj[iterator] = object[iterator];
    }
  }
  return newObj;
};
