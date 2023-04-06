import mongoose from "mongoose";

const Schema = mongoose.Schema;
const requestedFriendSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    requestedFriends: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("requestedFriends", requestedFriendSchema);
