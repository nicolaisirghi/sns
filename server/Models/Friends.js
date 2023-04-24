import mongoose from "mongoose";

const Schema = mongoose.Schema;
const friendSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    friends: [
      {
        type: String,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("friends", friendSchema);
