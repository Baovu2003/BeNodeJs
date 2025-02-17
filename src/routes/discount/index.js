const express = require('express');
const discountControllers = require('../../controller/discount.controllers');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.post("/amount",asyncHandler(discountControllers.getDiscountAmount))
router.get("/list_product_code",asyncHandler(discountControllers.getAllDiscountCodesWithProduct))


router.use(authenticationV2)

router.post("",asyncHandler(discountControllers.createDiscountCode))
router.patch("/updateDiscount/:discount_id",asyncHandler(discountControllers.updateDiscountCode))
router.get("",asyncHandler(discountControllers.getAllDiscountCodes))

module.exports =router;