'use strict';
const { cart } = require('../cart.model');
const { convetToObjectId } = require("../../untils");

const findCartById = async(cartId) =>{
    console.log("cartId ben cart repo",cartId)
    return cart.findOne({ _id: convetToObjectId(cartId), cart_state:"active" }).lean();
}
module.exports = {
    findCartById,

};