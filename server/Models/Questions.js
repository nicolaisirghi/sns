const mongoose = require("mongoose")
const Schema = mongoose.Schema
const questionSchema = new Schema({

        user:{
            type: Schema.Types.ObjectId,
            ref: "users",
            required:true
        },
        question: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        category: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true
        }
    },{versionKey:false}
)

module.exports = mongoose.model('questions', questionSchema)
