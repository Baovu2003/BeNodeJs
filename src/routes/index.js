const express = require('express');
const { apiKey, permissions } = require('../auth/checkAuth');
const router = express.Router();


// check apiKey:

// router.use(apiKey)
// check permissions
// router.use(permissions('0000'))

// Sau khi chạy qua 2 điều kiện trên mới cho chạy vào router
router.use('/v1/api/checkout',require("./checkout"))
router.use('/v1/api/discount',require("./discount"))
router.use('/v1/api/cart',require("./cart"))
router.use('/v1/api/product',require("./product"))
router.use('/v1/api',require("./access"))



module.exports =router;