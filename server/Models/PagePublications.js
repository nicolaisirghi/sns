import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;
const pagePublicationSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    files: [
      {
        _id: false,
        fileURL: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
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
    location: {
      type: String,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "pageComments",
        required: true,
      },
    ],
    time: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("pagePublications", pagePublicationSchema);
