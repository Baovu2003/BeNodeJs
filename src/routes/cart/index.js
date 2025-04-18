const express = require('express');
const cartControllers = require('../../controller/cart.controllers');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();




// router.use(authenticationV2)
router.post("/create",asyncHandler(cartControllers.createCart))
router.post("",asyncHandler(cartControllers.addToCart))
router.get("/",asyncHandler(cartControllers.listToCart))
router.post("/update",asyncHandler(cartControllers.updateCart))
router.post("/delete",asyncHandler(cartControllers.delete))



module.exports =router;