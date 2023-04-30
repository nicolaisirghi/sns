import mongoose from "mongoose";

const Schema = mongoose.Schema;
const pageAnswersSchema = new Schema(
  {
    answer: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },

    time: {
      type: Date,
      default: new Date(),
    },
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

export default mongoose.model("pageAnswers", pageAnswersSchema);
