import mongoose from "mongoose";

const Schema = mongoose.Schema;
const followerSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            unique: true
        },
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "users",
            },
        ],
        followPeople: [
            {
                type: Schema.Types.ObjectId,
                ref: "users",
            }
        ]
    },
    {versionKey: false}
);

export default mongoose.model("followers", followerSchema);
