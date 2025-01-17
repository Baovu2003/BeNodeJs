'use strict';

const keytokenModel = require("../model/keytoken.model");


class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        console.log({ publicKey, privateKey });
        try {
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey,  
            });

            //Nếu tạo thành công, nó sẽ trả về publicKey
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error('Error creating key token:', error);
            return error;
        }
    };
    

}

module.exports = KeyTokenService;   