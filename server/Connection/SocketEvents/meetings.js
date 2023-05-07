import { logger } from "../../Utils/Logger/logger.js";
import { SocketEvent } from "./eventTypes.js";

export const meetingEmit = (socket, args = {}) => {
  const { username } = socket.handshake.query;

  const [
    {
      data: { toUserName = username, roomName, meteredMeeting },
    },
  ] = args;

  socket
    .to(globalUsers[toUserName])
    .emit(SocketEvent.callTacker, { roomName, meteredMeeting });

  logger.info(
    `[Socket] Event callTacker sent to person with username : ${toUserName} and socket id : ${globalUsers[toUserName]}`
  );
};
