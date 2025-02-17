'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema({
    discount_name: { type: String, required: true }, // Tên mã giảm giá
    discount_description: { type: String, required: true }, // Mô tả mã giảm giá
    discount_type: { type: String, default: 'fixed_amount' }, // Loại giảm giá (cố định hoặc phần trăm)
    discount_value: { type: Number, required: true }, // Giá trị giảm giá
    discount_code: { type: String, required: true }, // Mã giảm giá
    discount_start_date: { type: Date, required: true }, // Ngày bắt đầu áp dụng
    discount_end_date: { type: Date, required: true }, // Ngày kết thúc áp dụng
    discount_max_uses: { type: Number, required: true }, // Tổng số lần có thể sử dụng mã giảm giá
    discount_uses_count: { type: Number, required: true }, // Số lần mã giảm giá đã được sử dụng
    discount_users_used: { type: Array, default: [] }, // Danh sách người dùng đã sử dụng mã
    discount_max_uses_per_user: { type: Number, required: true }, // Số lần tối đa một người dùng có thể sử dụng
    discount_min_order_value: { type: Number, required: true }, // Giá trị đơn hàng tối thiểu
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" }, // ID của shop sở hữu mã giảm giá
    discount_is_active: { type: Boolean, default: true }, // Trạng thái mã giảm giá (đang hoạt động hay không)
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] }, // Áp dụng cho tất cả hay sản phẩm cụ thể
    discount_product_ids: { type: Array, default: [] }, // Danh sách sản phẩm áp dụng
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema, COLLECTION_NAME);
