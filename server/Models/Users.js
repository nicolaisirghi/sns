import mongoose from "mongoose";
import { generateRandomChars } from "../Utils/Captcha/generateRandomChars.js";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
      default:
        "https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png",
    },
    education: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: () => generateRandomChars(),
      unique: true,
    },
    lastVisit: {
      type: Date,
      default: new Date(),
    },
  },
  { versionKey: false }
);
export default mongoose.model("users", userSchema);
