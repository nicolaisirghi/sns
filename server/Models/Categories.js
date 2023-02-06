const {Schema, model} = require("mongoose")
const CategorySchema = new Schema(
    {
        Category:{
            type:String,
            required:true
        }
    }, {versionKey: false}
)
module.exports = model("Categories", CategorySchema);