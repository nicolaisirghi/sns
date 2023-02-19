import { tokenServiceInstance as tokenService } from "../../Services/tokenService.js";
export const getToken = async (user) => {
  const userDto = { id: user._id, email: user.email };
  const tokens = tokenService.generateToken({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};
