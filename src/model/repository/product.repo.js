"use strict";
const { publicDecrypt } = require("crypto");
const {
    product,
    electronic,
    clothing,
    furniture,
} = require("../../model/product.model");
const { Types } = require("mongoose");
const findAllDraftsShopRepo = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip})
}
const findAllPublishedShopRepo = async ({ query, limit, skip }) => {
    return await await queryProduct({ query, limit, skip})
};

const publisProductByShopRepo = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if(!foundShop) {
      return null
    }
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const {modifiedCount} = await foundShop.updateOne(foundShop);
    return modifiedCount;
};
const unPublisProductByShopRepo = async ({ product_shop, product_id }) => {
    console.log("draftsProductByShopRepo")
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if(!foundShop) {
      return null
    }
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const {modifiedCount} = await foundShop.updateOne(foundShop);
    return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id") // Lấy thông tin `name` và `email` từ shop mà không lấy `_id`
        .sort({ updatedAt: -1 }) // Sắp xếp theo thời gian cập nhật mới nhất
        .skip(skip) // Bỏ qua số lượng bản ghi được chỉ định
        .limit(limit) // Giới hạn số lượng bản ghi trả về
        .lean(); // Trả về một bản sao JSON thuần túy, giúp cải thiện hiệu suất
};


module.exports = {
    findAllDraftsShopRepo,
    findAllPublishedShopRepo,
    publisProductByShopRepo,
    unPublisProductByShopRepo
};
