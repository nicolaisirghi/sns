import { meetingEmit } from "./meetings.js";
import { messageEmit } from "./messages.js";
import { SocketEvent } from "./eventTypes.js";

export const getSocketEvent = (event, socket, args) => {
  switch (event) {
    case SocketEvent.callInviter:
      return meetingEmit(socket, args);
    case SocketEvent.privateMessage:
      return messageEmit(socket, args);
    default:
      return null;
  }
};
