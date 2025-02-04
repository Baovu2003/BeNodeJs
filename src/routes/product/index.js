const express = require('express');
const productControllers = require('../../controller/product.controllers');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication,authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();


router.use(authenticationV2)
router.post('', asyncHandler(productControllers.createNewProduct));


module.exports =router;