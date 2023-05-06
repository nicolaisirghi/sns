export const meetingEmit = (socket, args = {}) => {
  const [
    {
      data: { toUserName, roomName },
    },
  ] = args;

  socket.to(globalUsers[toUserName]).emit("callTacker", { roomName });
};
