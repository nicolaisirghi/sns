import mongoose from "mongoose";

const Schema = mongoose.Schema;
const publicationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    filesData: [
      {
        fileURL: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],

    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { versionKey: false }
);
export default mongoose.model("publications", publicationSchema);
