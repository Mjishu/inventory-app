const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {type:String, required:true, maxLength:50, minLength:2},
    desc:{type:String, required:true,maxLength:200,minLength:3},
    numInstock: {type:Number, required: true},
    sku: {type:String, required:true,minLength:5},
    price:{type:Number, required: true},
    category: [{type:Schema.Types.ObjectId, ref:"Category", required:true}],
})

itemSchema.virtual("url").get(function(){
    return `catalog/items/${this._id}`
})

module.exports = mongoose.model("Item", itemSchema)