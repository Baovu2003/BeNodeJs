"use strict";

const { findById } = require("../services/apiKey.services");

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
    console.log("req.headers",req.headers)
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();

        if (!key) {
            return res.status(403).json({
                message: "API key is missing",
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

const permissions = (permission) => {
    return (req, res, next) => {
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
