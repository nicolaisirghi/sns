const {Schema, model} = require('mongoose')

const tokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "users", required: true},
    refreshToken: {type: String, required: true}
}, {versionKey: false})
module.exports = model('tokens', tokenSchema)