import {checkUsersOnline} from "./usersOnline.js";
export const createGlobalVariables = async ()=> {
    global.usersOnline = await checkUsersOnline();
};