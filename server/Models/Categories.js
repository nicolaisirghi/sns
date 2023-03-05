import { model, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    Category: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);
export default model("Categories", CategorySchema);
