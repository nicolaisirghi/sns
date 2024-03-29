import Users from "../Models/Users.js";

export const checkUsersOnline = async () => {
  const users = await Users.find();
  const usersID = users.map((user) => [user.username, null]);
  const usersOnline = Object.fromEntries(usersID);

  // global variables
  return usersOnline;
};
