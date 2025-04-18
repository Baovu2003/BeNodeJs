"use strict";
const {Schema, model} = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema({
    cart_state:{
        type:String, required:true,
        enum:['active','completed','pending','failed']
    },
    cart_products:{type:Array,required:true,default:[]},
    cart_count_products:{type:Number,default:0},
    cart_userId:{type:Number,required:true}
},{
    collection:COLLECTION_NAME,
    timeseries:{
        createAt:"createOn",
        updateAt:"modifiedOn",
    }
}
)
module.exports = {
    cart:model(DOCUMENT_NAME,cartSchema)
}