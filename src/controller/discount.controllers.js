'use strict';


const DiscountService = require("../services/discount.services");
const { SuccessResponse } = require("../core/success.response");

 class DiscountController {

    createDiscountCode = async(req,res,next) => {
        console.log("👉 Dữ liệu nhận được:", req.body);
        console.log("shopId:"   ,req.user)
        new SuccessResponse({
            message: "Create Discount success",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                discount_shopId:req.user.userId
            })
        }).send(res);
    }
    updateDiscountCode = async(req,res,next) => {
        console.log("👉 Dữ liệu nhận được:", req.body);
        console.log("req.params.discount_id",req.params.discount_id)
        new SuccessResponse({
            message: "Update Discount success",
            metadata: await DiscountService.updateDiscountCode({
                ...req.body,
                discount_id: req.params.discount_id,  
                shopId: req.body.shopId,              
            })
        }).send(res);
    }

    getAllDiscountCodes = async(req,res,next) => {
        new SuccessResponse({
            message: "Get All Discount success",
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId:req.user.userId
            })
        }).send(res);
    }
    getDiscountAmount = async(req,res,next) => {
        new SuccessResponse({
            message: "Get Discount Amount success",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res);
    }
    getAllDiscountCodesWithProduct = async(req,res,next) => {
        new SuccessResponse({
            message: "Get All Discount with Product success",
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res);
    }
    
 }
module.exports = new DiscountController();