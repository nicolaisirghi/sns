import mongoose from "mongoose";

const Schema = mongoose.Schema;
const followerSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: String,
        unique: true,
      },
    ],
    followPeople: [
      {
        type: String,
        unique: true,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("followers", followerSchema);
