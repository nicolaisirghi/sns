export const sendNotification = ({ to, event, data }) => {
  // eslint-disable-next-line no-undef
  socketIO.to(usersOnline[to]).emit(event, data);
};
