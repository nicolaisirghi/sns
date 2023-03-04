import mongoose from "mongoose";

const Schema = mongoose.Schema;
const friendSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("friends", friendSchema);
