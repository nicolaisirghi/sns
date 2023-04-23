import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);
export default model("messages", MessageSchema);
