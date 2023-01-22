const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        default: "https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png"
    },
    education:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {versionKey: false})

module.exports = mongoose.model("users", userSchema)