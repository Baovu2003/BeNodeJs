const express = require('express');
const productControllers = require('../../controller/product.controllers');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication,authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.get("/search/:keySearch",(productControllers.searchProductShop))
router.get("",asyncHandler(productControllers.findAllProducts))
router.get("/:product_id",(productControllers.findProductDetail))


router.use(authenticationV2)

router.post('', asyncHandler(productControllers.createNewProduct));
router.patch('/:productId', asyncHandler(productControllers.updateProduct));
router.post('/published/:id', asyncHandler(productControllers.updatePublishedProductByShop));
router.post('/unPublished/:id', asyncHandler(productControllers.unPublisProductByShop));
// query
router.get('/drafts/all', asyncHandler(productControllers.getAllDrafsShop));
router.get('/published/all', asyncHandler(productControllers.getAllPublishedShop));

module.exports =router;