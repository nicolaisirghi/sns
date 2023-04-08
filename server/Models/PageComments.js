import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;
const pageCommentsSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now(),
    },
    answers: [
      {
        type: Types.ObjectId,
        ref: "pageanswers",
      },
    ],
    likes: [
      {
        _id: false,
        user: {
          type: String,
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
