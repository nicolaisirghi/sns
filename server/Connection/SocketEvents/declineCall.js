import { SocketEvent } from "./eventTypes.js";
import { logger } from "../../Utils/Logger/logger.js";

export const declinedCall = (socket, args) => {
  try {
    const [
      {
        data: { toUserName = null, isDeclined = true },
      },
    ] = args;
    console.log("To username : ", toUserName);
    console.log("GlobalUsers : ", globalUsers[toUserName]);
    socket
      .to(globalUsers[toUserName])
      .emit(SocketEvent.declinedCall, { isDeclined });
  } catch (e) {
    logger.error(`[Socket] ${e.message}`);
  }
};
