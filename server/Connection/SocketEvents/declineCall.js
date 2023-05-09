import { SocketEvent } from "./eventTypes.js";

export const declinedCall = (socket, args) => {
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
};
