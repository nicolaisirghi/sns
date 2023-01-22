const {Schema,model} = require('mongoose')

const tokenSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:"users",required:true},
    refreshToken:{type:String,required:true}
})
module.exports = model('tokens',tokenSchema)