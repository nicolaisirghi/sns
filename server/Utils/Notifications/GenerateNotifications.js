export const requestFriend = (fromUser) => {
  return {
    name: fromUser.name,
    fromUserID: fromUser.id,
    type: "request",
  };
};
export const publicatePost = (fromUser) => {
  return {
    name: fromUser.name,
    fromUserID: fromUser.id,
    type: "publish",
  };
};

export const followUser = (fromUser) => {
  return {
    name: fromUser.name,
    fromUserID: fromUser.id,
    type: "following",
  };
};
