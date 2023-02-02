const {Schema, model} = require("mongoose")
const MailSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        link: {
            type: String,
            default: ''
        },
        isActivated: {
            type: Boolean,
            default: false
        }
    },{versionKey:false}
)
module.exports = model("mails",MailSchema);