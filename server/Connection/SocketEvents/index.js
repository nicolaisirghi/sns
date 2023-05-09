import { meetingEmit } from "./meetings.js";
import { messageEmit } from "./messages.js";
import { SocketEvent } from "./eventTypes.js";
import { userDisconnected } from "./userDisconnected.js";
import { declinedCall } from "./declineCall.js";

export const getSocketEvent = (event, socket, args) => {
  switch (event) {
    case SocketEvent.callInviter:
      return meetingEmit(socket, args);
    case SocketEvent.privateMessage:
      return messageEmit(socket, args);
    case SocketEvent.disconnect:
      return userDisconnected(socket);
    case SocketEvent.declinedCall:
      return declinedCall(socket, args);
    default:
      return null;
  }
};
