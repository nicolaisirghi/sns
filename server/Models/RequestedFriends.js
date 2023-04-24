import mongoose from "mongoose";

const Schema = mongoose.Schema;
const requestedFriendSchema = new Schema(
  {
    user: {
      type: String,
    },
    requestedFriends: [
      {
        type: String,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("requestedFriends", requestedFriendSchema);
