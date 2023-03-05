import { model, Schema } from "mongoose";

const tokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    refreshToken: { type: String, required: true },
  },
  { versionKey: false }
);
export default model("tokens", tokenSchema);
