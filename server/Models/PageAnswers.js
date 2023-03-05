import mongoose from "mongoose";

const Schema = mongoose.Schema;
const pageAnswersSchema = new Schema(
    {
        answer:{
            type:String,
            required:true
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:"users",
            required: true
        },

    },
    {
        versionKey: false
    }
)

export default mongoose.model("pageAnswers", pageAnswersSchema);
