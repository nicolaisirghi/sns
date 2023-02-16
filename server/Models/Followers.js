import mongoose from "mongoose"

const Schema = mongoose.Schema
const followerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    followers:
        [
            {
                type: user
            }
        ]

}, {versionKey: false})

export default mongoose.model('followers', followerSchema)