import { checkUsersOnline } from "./usersOnline.js";
import { gc } from "./GoogleStorage/createStorage.js";

export const createGlobalVariables = async () => {
  global.globalUsers = await checkUsersOnline();
  global.googleStorage = gc;
};
