"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../model/discount.model");
const {
    fillAllDiscountCodeUnselect,
    checkDiscountExists,
} = require("../model/repository/discount.repo");
const { findAllProducts } = require("../model/repository/product.repo");
const { convetToObjectId } = require("../untils");

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            discount_code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_id,
            users_used,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
        } = payload;

        console.log("Payload received:", payload);
        if (new Date(end_date) < new Date(start_date)) {
            throw new BadRequestError("Start_date before end_date");
        }
        console.log({ shopId })
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: discount_code,
                discount_shopId: convetToObjectId(shopId),
            },
        });
        console.log({ foundDiscount })

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount code has already been used");
        }

        const newDiscount = new discountModel({
            discount_code: discount_code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_is_active: is_active,
            discount_shopId: (shopId),
            discount_min_order_value: min_order_value || 0,
            discount_product_ids:
                applies_to === "all" ? [] : (product_id),
            discount_applies_to: applies_to,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_max_uses_per_user: max_uses_per_user,
            discount_users_used: users_used,
        });
        console.log(" Discount before save:", newDiscount);
        await newDiscount.save();
        return newDiscount;
    }

    static async updateDiscountCode({ discount_id, shopId, updateData }) {
        console.log({ discount_id, shopId, updateData })
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                _id: convetToObjectId(discount_id),
                discount_shopId: convetToObjectId(shopId),
            },
        });
        console.log(" Found discount code before update:", foundDiscount);
        if (!foundDiscount) {
            throw new NotFoundError("Discount not exists");
        }
        console.log(updateData.discount_code !== foundDiscount.discount_code)
        //  // Exist disocunt_code va tránh trùng với chính nó va update
        const existingDiscount = await discountModel.findOne({
            discount_code: updateData.discount_code,
            discount_shopId: convetToObjectId(shopId),
            _id: { $ne: convetToObjectId(discount_id) },
        })
        if (existingDiscount) {
            throw new BadRequestError("Discount code already exists");
        }

        //  end_date > start_date
        if (updateData.discount_start_date && updateData.discount_end_date) {
            if (new Date(updateData.discount_end_date) < new Date(updateData.discount_start_date)) {
                throw new BadRequestError("End date must be after start date");
            }
        }
        Object.keys(updateData).forEach((key) => {
            console.log("lkey", key)
            if (updateData[key] != undefined) {
                foundDiscount[key] = updateData[key]
            }
        })
        console.log("discount after update: " + foundDiscount)
        await foundDiscount.save();
        return foundDiscount;

        // ==========================Cach 2====================================
        // const updatedDiscount = await discountModel.findByIdAndUpdate(
        //     discount_id,
        //     { $set: updateData },
        //     { new: true } // Trả về bản ghi mới sau khi cập nhật
        // );
        // console.log("discount after update: " + updatedDiscount)      
        // return updatedDiscount;
    }

    static async getAllDiscountCodesWithProduct({
        code,
        shopId,
        userId,
        limit,
        page,
    }) {

        const typeShopId = convetToObjectId(shopId)
        console.log({ typeShopId, shopId, userId, limit, page })
        const foundDiscount = await discountModel
            .findOne({
                discount_code: code,
                discount_shopId: convetToObjectId(shopId),
            })
            .lean();
        console.log({ foundDiscount })
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount not exists");
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if (discount_applies_to === "all") {
            products = findAllProducts({
                filter: {
                    product_shop: convetToObjectId(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }

        if (discount_applies_to === "specific") {
            products = findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }
        return products;
    }

    static async getAllDiscountCodeByShop({ limit, page, shopId }) {
        console.log(">>> shopId trước khi convert:", shopId);
console.log(">>> shopId sau khi convert:", convetToObjectId(shopId));

        const discounts = await fillAllDiscountCodeUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convetToObjectId(shopId),
                discount_is_active: true,
            },
            unSelect: ["__v", "discount_shopId"],
            model: discountModel,
        });
        return discounts;
    }

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        console.log("codeId", codeId, "userId", userId, "shopId", shopId, "products", products)
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convetToObjectId(shopId),
            },
        });
        console.log("foundDiscount", foundDiscount)
        if (!foundDiscount) throw new NotFoundError("Discount not exist");
        const {
            discount_is_active,
            discount_max_uses,
            discount_end_date,
            discount_start_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_value,
            discount_type
        } = foundDiscount;
        if (!discount_is_active) throw new NotFoundError("Discount exprise");
        if (!discount_max_uses) throw new NotFoundError("Discount are out!");
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0);
            console.log("totalOrder",totalOrder)
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(
                    "discount require a minimum of " + discount_min_order_value
                );
            }
        }
        // Moi user chi duoc su dung 1 lan
        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(
                (user) => user.userId === userId
            );
            console.log("userUserDiscount", userUserDiscount)
            if (userUserDiscount) {
            }
        }
        let amount = 0;
        if (discount_end_date && new Date(discount_end_date) < new Date()) {
            amount = 0
            throw new NotFoundError("Discount Expired");
        } else {
              // Tính toán giảm giá nếu phiếu vẫn còn hiệu lực
            // check xem discount laf "fix-amount" hay "specific"
            amount = discount_type === "fixed_amount"
                ? discount_value
                : totalOrder * (discount_value / 100);
        }
        console.log({
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
            annouce:"Discount is exist from to "+discount_end_date
        })
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
            annouce:"Discount is exist from to "+discount_end_date
        };
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convetToObjectId(shopId),
        });

        return deleted;
    }
    static async cancleDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convetToObjectId(shopId),
            },
        });

        if (!foundDiscount) throw new NotFoundError("Discount not exist");
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: { userId },
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            },
        });
    }
}

module.exports = DiscountService;