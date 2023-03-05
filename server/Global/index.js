import { checkUsersOnline } from "./usersOnline.js";
import { gc } from "./GoogleStorage/createStorage.js";
export const createGlobalVariables = async () => {
  global.usersOnline = await checkUsersOnline();
  global.googleStorage = gc;
};
