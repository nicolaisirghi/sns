import { model, Schema } from "mongoose";

const GroupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    descriptionGroup: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: "https://www.iconsdb.com/icons/preview/black/messenger-xl.png",
    },
    creationDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        role: {
          type: String,
          enum: ["user", "admin"],
          required: true,
        },
        ref: "users",
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { versionKey: false }
);

export default model("groups", GroupSchema);
