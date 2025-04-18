

const CartService = require("../services/cart.services");
const { SuccessResponse } = require("../core/success.response");

 class CartController {
    /** 
     * @desc add to cart for user
     * @param {int} userId
     * @param {*} res
     * @param {*} next
     * @method post
     * @url /v1/api/cart/user
     * @return{
     * }

     * 
     * 
     * */ 
    createCart = async(req,res,next) => {
        console.log("👉 Dữ liệu nhận được:", req.body);
        new SuccessResponse({
            message: "Create new cart success",
            metadata: await CartService.createUserCart({
                ...req.body,
            })
        }).send(res);
    }
    addToCart = async(req,res,next) => {
        console.log("👉 Dữ liệu nhận được:", req.body);
        new SuccessResponse({
            message: "Add to cart success",
            metadata: await CartService.addTocart({
                ...req.body,
            })
        }).send(res);
    }
    updateCart = async(req,res,next) => {
        console.log("👉 Dữ liệu nhận được:", req.body);
        new SuccessResponse({
            message: "CUpdate cart success",
            metadata: await CartService.addToCarV2({
                ...req.body,
            })
        }).send(res);
    }

    delete = async(req,res,next) => {
        console.log("👉 Dữ liệu nhận được:", req.body);
        new SuccessResponse({
            message: "Delete cart success",
            metadata: await CartService.deleteUserCart({
                ...req.body,
            })
        }).send(res);
    }

    listToCart = async(req,res,next) => {
        console.log("👉 Dữ liệu nhận được:", req.body);
        new SuccessResponse({
            message: "List cart ",
            metadata: await CartService.getListUsercart({
                ...req.query
            })
        }).send(res);
    }



 }
 module.exports = new CartController();
