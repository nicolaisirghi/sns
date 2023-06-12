import { logger } from "../../Utils/Logger/logger.js";
import { SocketEvent } from "./eventTypes.js";

export const messageEmit = (socket, args = {}) => {
  try {
    console.log("[Socket ARGS]: ", args);
    const { toUser, message } = args;

    socket.to(globalUsers[toUser]).emit(SocketEvent.privateMessage, message);

    logger.info(
      `[Socket] Event private message sent to person with username : ${toUser} and socket id : ${globalUsers[toUser]}`
    );
  } catch (e) {
    logger.error(`[Socket] ${e.message}`);
  }
};
