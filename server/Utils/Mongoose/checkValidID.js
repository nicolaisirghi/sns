import mongoose from "mongoose";
const ObjectID = mongoose.Types.ObjectId;

export const isValidObjectID = (id) => {
  if (ObjectID.isValid(id)) {
    if (String(new ObjectID(id) === id)) return true;
    return false;
  }
  return false;
};
