const express = require('express');
const accessControllers = require('../../controller/access.controllers');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


// sign up
// Mục đích của asyncHandler là để bắt các lỗi xảy ra trong hàm signup
//  và tự động chuyển chúng đến hàm next() 
//  (để được xử lý bởi middleware xử lý lỗi)
router.post('/shop/signup', asyncHandler(accessControllers.signup))
router.post('/shop/login', asyncHandler(accessControllers.login))

// Viet authentication de check co phai chinh chu trc khong moi cho logout

// =======================authentication===============================
router.use(authentication)
router.post('/shop/logout', asyncHandler(accessControllers.logout));
router.post('/shop/handlerRefreshToken', asyncHandler(accessControllers.handlerRefreshToken));

module.exports =router;