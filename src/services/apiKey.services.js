"use strict";

const apiKeyModel = require("../model/apiKey.model");
const crypto = require("crypto");
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
