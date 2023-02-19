import { Schema, model } from "mongoose";
const MailSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    link: {
      type: String,
      default: "",
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);
export default model("mails", MailSchema);
