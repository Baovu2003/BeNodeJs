"use strict";

const { update } = require("lodash");
const keytokenModel = require("../model/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    console.log("Bên KeyTokenService: ", {
      userId,
      publicKey,
      privateKey,
      refreshToken,
    });
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
      const filter = { user: userId };
      const update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      console.log("filter:", JSON.stringify(filter));
      console.log("update:", JSON.stringify(update));

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      //Nếu tạo thành công, nó sẽ trả về publicKey
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.error("Error creating key token:", error);
      return error;
    }
  };

  static findByUserId = async ({ userId }) => {
    console.log("userId in keyTokenService: " + userId);
    const userObjectId = new Types.ObjectId(userId);
    return await keytokenModel.findOne({ user: userObjectId }).lean();
  };
  // static findByUserId = async ({ userId }) => {
  //     try {
  //         if (!Types.ObjectId.isValid(userId)) {
  //             throw new Error("Invalid userId format");
  //         }

  //         const userObjectId = new Types.ObjectId(userId);
  //         const keyStore = await keytokenModel.findOne({ user: userObjectId }).lean();

  //         if (!keyStore) {
  //             console.error("No KeyStore found for user ID:", userId);
  //         }
  //         return keyStore;
  //     } catch (error) {
  //         console.error("Error in findByUserId:", error.message);
  //         throw new Error("Failed to retrieve KeyStore");
  //     }
  // };

  static removeKeyById = async (userId) => {
    return await keytokenModel.deleteOne(userId).lean();
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne(refreshToken);
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.findOneAndDelete({ user: userId });
  };
}

module.exports = KeyTokenService;
