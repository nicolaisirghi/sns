import mongoose from "mongoose";

const Schema = mongoose.Schema;
const pageCommentsSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    time: {
      type: Date,
      default: Date.now(),
    },
    likes: [
      {
        _id: false,
        user: {
          type: Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        date: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("pageComments", pageCommentsSchema);
