import mongoose from "mongoose";
const Schema = mongoose.Schema;
const answerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
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
    likes: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

export default mongoose.model("answers", answerSchema);
