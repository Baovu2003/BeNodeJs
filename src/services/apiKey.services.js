"use strict";

const apiKeyModel = require("../model/apiKey.model");


// Hàm findById:
// Tìm một API key hợp lệ (status: true) trong cơ sở dữ liệu (apiKeyModel).
// Trả về thông tin API key nếu tìm thấy; nếu không, trả về null.

const findById = async (key) => {
    try {
        //     const newKey = await apiKeyModel.create({key:crypto.randomBytes(64).toString('hex'),permissions:['0000']});
        //    console.log({newKey});
        const objectKey = await apiKeyModel.findOne({ key, status: true }).lean();
        return objectKey;
    } catch (error) {
        console.error("Error fetching API key from database: ", error);
        throw new Error("Error querying the database");
    }
};

module.exports = {
    findById,
};
