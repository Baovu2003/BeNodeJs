const {inventory} = require("../inventory.model")
const { Types } = require("mongoose");

const insertInventory = async ({
    productId, shopId,stock,location="unknow"
}) =>{
    console.log("insertInventory",{productId, shopId, stock, location})
    return await inventory.create({
        inven_productId: productId,
        inven_shopId:shopId,
        inven_stock:stock,
        inven_location:location,
    })
}
module.exports = {
    insertInventory
}