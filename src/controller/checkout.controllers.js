

const CheckoutService = require("../services/checkout.services");
const { SuccessResponse } = require("../core/success.response");

 class CheckoutController {
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

    checkoutReview = async(req,res,next) => {
        console.log("👉 Dữ liệu nhận được:", req.body);
        new SuccessResponse({
            message: "Checkout new cart success",
            metadata: await CheckoutService.checkoutReview({
                ...req.body,
            })
        }).send(res);
    }
 


 }
 module.exports = new CheckoutController();
