"use strict";
const { publicDecrypt } = require("crypto");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../model/product.model");
const { Types } = require("mongoose");
const { unGetSelectData, convetToObjectId } = require("../../untils");
const { NotFoundError } = require("../../core/error.response");



const findAllDraftsShopRepo = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const findAllPublishedShopRepo = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
// const searchProducts = async ({ keySearch}) => {
//     const regexSearch = new RegExp(keySearch);
//     console.log(regexSearch)
//     const result = await product.find({
//         $text:{$search: regexSearch}},
//         {score: {$meta:'textscore'}}
//        ).lean()

//        return result;
// }
const searchProducts = async ({ keySearch }) => {
  if (!keySearch || keySearch.trim().length === 0) {
    return []; 
  }

  console.log({ keySearch });

  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: keySearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return result;
};

const publisProductByShopRepo = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) {
    throw new NotFoundError(`Product not found`);
  }
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
const unPublisProductByShopRepo = async ({ product_shop, product_id }) => {
  console.log("draftsProductByShopRepo");
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  console.log("foundShop",foundShop);
  if (!foundShop) {
    throw new NotFoundError(`Product not found`);
  }
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const findAllProducts = async ({ limit = 50, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();
  return products;
};
const findProductDetail = async ({ product_id, unSelect }) => {
  return await product
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
};

const updateProductById = async (
  { productId, bodyUpdate, model },
  isNew = true
) => {
  console.log("bodyUpdate ben product.repo cua updateproductById", bodyUpdate);
return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
});

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

const getProductById = async (productId) => {
  return await product.findById({_id: convetToObjectId(productId)}).lean();
};

module.exports = {
  findAllDraftsShopRepo,
  findAllPublishedShopRepo,
  publisProductByShopRepo,
  unPublisProductByShopRepo,
  searchProducts,
  findAllProducts,
  findProductDetail,
  updateProductById,
  getProductById
};
