const mongoose = require("mongoose")
const Schema = mongoose.Schema
const publicationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    file: {
        type: Buffer
    },
    category:{
        type:String,required:true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required:true
    }
}, {versionKey: false})
module.exports = mongoose.model("publications",publicationSchema)