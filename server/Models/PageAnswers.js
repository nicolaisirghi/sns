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
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("pageAnswers", pageAnswersSchema);
