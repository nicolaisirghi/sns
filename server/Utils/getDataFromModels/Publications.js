import Users from "../../Models/Users.js";

export const getLikes = async (publications) => {
  const usersInfo = await Promise.all(
    publications.likes.map((like) =>
      Users.findById(like.user, { photoURL: 1, name: 1 })
    )
  );
  const likesData = publications.likes.map((like, index) => ({
    date: like.date,
    user: usersInfo[index],
  }));

  return Object.assign(publications, { likes: likesData });
};
