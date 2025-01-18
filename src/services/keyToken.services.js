'use strict';

const { update } = require("lodash");
const keytokenModel = require("../model/keytoken.model");


class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey,refreshToken }) => {
        console.log({userId, publicKey, privateKey,refreshToken });
        try {
            // Level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,  
            // });

            // level cao 
// ======filter: { userId }===================
// Đây là điều kiện lọc để tìm tài liệu cần cập nhật. 
// Nó sử dụng trường userId (giá trị cụ thể của userId phải được truyền vào trước đó).


// Đây là các giá trị mới sẽ được cập nhật vào tài liệu tìm thấy.
//  Các trường publicKey, privateKey, refreshTokenUsed, và refreshToken sẽ được thêm hoặc thay thế


// upsert: true:===>  Nếu không tìm thấy tài liệu khớp với filter,
//  một tài liệu mới sẽ được tạo với dữ liệu từ update.
// new: true: Kết quả trả về từ lệnh sẽ là tài liệu mới nhất sau khi cập nhật.
            const filter = {user:userId}, update={
                publicKey,
                privateKey,refreshTokenUsed:[],refreshToken
            }, options ={upsert:true,new:true};

            const tokens = await keytokenModel.findOneAndUpdate(filter,update,options)

            //Nếu tạo thành công, nó sẽ trả về publicKey
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error('Error creating key token:', error);
            return error;
        }
    };
    

}

module.exports = KeyTokenService;   