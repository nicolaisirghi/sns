import mongoose from "mongoose";

const Schema = mongoose.Schema;
const followerSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: String,
      },
    ],
    followPeople: [
      {
        type: String,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("followers", followerSchema);
