"use strict";

const shopModel = require("../model/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.services");
const { createTokenPair } = require("../auth/authUtils");
const { getInforData } = require("../untils");

const RoleShop = {
    SHOP: "SHOP",
    WRITTER: "WRITTER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        console.log("signUp", name, email, password);
        try {
            // Step 1: Check if email exists in the database
            const hodelShop = await shopModel.findOne({ email });

            if (hodelShop) {
                return {
                    code: "XXXX",
                    message: "Email already exists",
                };
            }

            // Step 2: Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // Step 3: Create new shop
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            });

            console.log({ newShop });

            if (newShop) {
                
                // Step 4: Generate RSA key pair for token signing and verification
                // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: "pkcs1",
                //         format: "pem",
                //     },
                //     privateKeyEncoding: {
                //         type: "pkcs1",
                //         format: "pem",
                //     },
                // });

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');



                console.log("Generated RSA Key Pair:", { privateKey, publicKey });

                // Step 5: Store public key string using KeyTokenService
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey, // Correcting the naming to match the other usage
                    
                });
                
                console.log("Key stored:", keyStore);
                if (!keyStore) {
                    return {
                        code: "XXXX",
                        message: "Error keyStore",
                    };
                }

                // Step 6: Create token pair
                const tokens = await createTokenPair(
                    {
                        userId: newShop._id,
                        email,
                    },
                    publicKey,
                    privateKey
                );

                console.log("Created token pair:", tokens);

                // Step 7: Return the response with shop details and token pair
                return {
                    code: "201",
                    metadata: {
                        shop: getInforData({ fileds: ['_id', 'name', 'email'], object: newShop }),  // Chú ý đã thay 'objectId' thành 'object'
                        tokens,
                    },
                };
                
            }
        } catch (error) {
            console.error("Error during signup:", error.message);
            return {
                code: "ERROR",
                message: error.message,
            };
        }
    };
}

module.exports = AccessService;
