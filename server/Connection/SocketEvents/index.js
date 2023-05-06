import { meetingEmit } from "./meetings.js";

export const getSocketEvent = (event, socket, args) => {
  switch (event) {
    case "callInviter":
      return meetingEmit(socket, args);
    default:
      return null;
  }
};
