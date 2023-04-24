export const sendNotification = ({ to, event, data }) => {
  // eslint-disable-next-line no-undef
  socketIO.to(globalUsers[to]).emit(event, data);
};
