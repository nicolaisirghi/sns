import mongoose from "mongoose"

const Schema = mongoose.Schema
const notificationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description:
        {
            type: String
        },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    notificationType:
        {
            type: String,
            enum: ['request','comment','answer','mention','publish','following'],
            required:true
        },
    date:{
        type: Date,
        required:true
    }
}, {versionKey: false})

export default mongoose.model('notifications', notificationSchema)