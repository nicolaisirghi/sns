import { SocketEvent } from "./eventTypes.js";
import { logger } from "../../Utils/Logger/logger.js";

export const declinedCall = (socket, args) => {
  try {
    const [
      {
        data: { toUserName = null, isDeclined = true },
      },
    ] = args;

    socket
      .to(globalUsers[toUserName])
      .emit(SocketEvent.responseDeclinedCall, { isDeclined });
  } catch (e) {
    logger.error(`[Socket] ${e.message}`);
  }
};
