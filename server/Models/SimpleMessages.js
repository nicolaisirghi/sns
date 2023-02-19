import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    to: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
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
