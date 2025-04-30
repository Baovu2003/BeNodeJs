const express = require('express');
const checkoutControllers = require('../../controller/checkout.controllers');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();




// router.use(authenticationV2)
router.post("/review",(checkoutControllers.checkoutReview))




module.exports =router;