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
    fileData: {
      type: Buffer,
    },
      fileName:{
        type:String
      },
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
