import mongoose from "mongoose";

const Schema = mongoose.Schema;
const answerSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    answeredTo: {
      type: Schema.Types.ObjectId,
      ref: "questions",
      required: true,
    },

    answer: {
      type: String,
      required: true,
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
  { versionKey: false }
);

export default mongoose.model("answers", answerSchema);
