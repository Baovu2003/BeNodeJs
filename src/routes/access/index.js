const express = require('express');
const accessControllers = require('../../controller/access.controllers');
const { asyncHandler } = require('../../auth/checkAuth');
const router = express.Router();


// sign up
// Mục đích của asyncHandler là để bắt các lỗi xảy ra trong hàm signup
//  và tự động chuyển chúng đến hàm next() 
//  (để được xử lý bởi middleware xử lý lỗi)
router.post('/shop/signup', asyncHandler(accessControllers.signup))
router.post('/shop/login', asyncHandler(accessControllers.login))


module.exports =router;