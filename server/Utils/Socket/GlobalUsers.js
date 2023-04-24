import { createArray } from "../CustomMethods/Objects.js";

export const getUsersOnline = () => {
  const usersArray = createArray(globalUsers);
  return usersArray
    .filter((user) => {
      const index = Object.keys(user)[0];
      return user[index] !== null;
    })
    .map((user) => Object.keys(user)[0]);
};
