export const meetingEmit = (socket, args = {}) => {
  const [
    {
      data: { toUserName, roomName, meteredMeeting },
    },
  ] = args;

  socket
    .to(globalUsers[toUserName])
    .emit("callTacker", { roomName, meteredMeeting });
};
