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
    console.log("req.headers",req.headers)
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        console.log("key",key)
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

// Đầu vào (fn): Hàm này nhận một hàm bất đồng bộ (fn) làm tham số.
//  Trong ví dụ trên, fn chính là accessControllers.signup.

// Trả về: Hàm này trả về một hàm mới (chính là hàm xử lý route) với ba tham số req, res, và next.

// Xử lý lỗi:
// Phần quan trọng là .catch(next) ở cuối. Vì fn (ở đây là accessControllers.signup)
//  là một hàm bất đồng bộ (trả về Promise), nếu có lỗi xảy ra hoặc Promise bị từ chối (rejected), 

// .catch(next) sẽ bắt lỗi và chuyển nó tới next().
// next() là một hàm trong Express dùng để chuyển điều khiển tới middleware tiếp theo, 
// ở đây nó sẽ chuyển lỗi đến middleware xử lý lỗi của ứng dụng.


module.exports = {
    apiKey,permissions
}
