import mongoose from "mongoose";

const Schema = mongoose.Schema;
const conferenceSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    localization: {
      type: String,
    },
    isOnline:{
      type:Boolean,
    },
    link: {
      type: String,
    },
    time: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { versionKey: false }
);

export default mongoose.model("conference", conferenceSchema);
