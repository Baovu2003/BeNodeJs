"use strict";

const { findById } = require("../services/apiKey.services");

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: "authorization",
};

// Lấy API key từ header x-api-key.
// Kiểm tra API key bằng cách gọi hàm findById từ apiKey.services.
// Nếu API key không tồn tại hoặc không hợp lệ, trả về mã lỗi 403.
// Nếu hợp lệ, lưu trữ thông tin API key vào req.objKey và chuyển tiếp đến middleware tiếp theo.

const apiKey = async (req, res, next) => {
    console.log("req.headers ben checkAuth",req.headers)
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        console.log("APIkey ben checkAuth",key)
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error (API key is missing)",
            });
        }

        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Invalid or inactive API key",
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        console.error("API key verification error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
     }
};


// Middleware permissions(permission):
// Lấy thông tin permissions từ req.objKey.
// Kiểm tra xem quyền hạn có bao gồm quyền yêu cầu hay không (permission).
// Nếu không, trả về lỗi 403; nếu hợp lệ, chuyển tiếp đến middleware tiếp theo.
const permissions = (permission) => {
   
    return (req, res, next) => {
        console.log("req.objKey: ",req.objKey)
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission denied",
            });
        }

        console.log("Permissions", req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: "Permission denied",
            });
        }
        return next();
    };
};



module.exports = {
    apiKey,permissions
}
