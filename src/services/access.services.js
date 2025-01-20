"use strict";

const shopModel = require("../model/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.services");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInforData } = require("../untils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.services");

const RoleShop = {
  SHOP: "SHOP",
  WRITTER: "WRITTER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  // 1 -  Check token da duoc su dụng hay chua.
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log('[1]----',{ userId, email });
      //  Khi xac nhan dc thang nay thi he thong phat hien userId nay da bi ro ri
      // Neu dc su dung roi thì no se xoa token trong keyStore

      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend!!! Please relogin");
    }

    // Neu nhu chua co thi chung ta viet 1 ham tim kiem refreshToken

    const holderToken = KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered 01");
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    console.log('[2]----',{ userId, email });
    const foundShop = await KeyTokenService.findByEmail(email);
    if(!foundShop) throw new AuthFailureError("Shop not registered 02");
    
    // Neu nhu tim dc cap lai 1 accessToken moi dong thoi dua refreshToken nay vao da dc su dung

    // create 1 cap moi
    const tokens = await createTokenPair({userId,email,},
      holderToken.publicKey,
      holderToken.privateKey
    );

    // --Update token
    await holderToken.update({
      $set: {
        refreshTokenUsed: tokens.refreshToken
      
      },
      $addToSet: {
          refreshTokenUsed: refreshToken
      }
    })

    return {
      user: {userId,email},
      tokens
    }

  };

  static logout = async (keyStore) => {
    const dellKey = KeyTokenService.removeKeyById(keyStore);
    console.log({ dellKey });
    return dellKey;
  };

  /*
    1 - check email in db
    2 - match password
    3 - create AccessToken and resfreshToken
    4 - generate token
    5 - get data return login
    */

  static login = async ({ email, password, refreshToken = null }) => {
    console.log({ email });
    //1.
    const foundShop = await findByEmail({ email });
    console.log({ email, foundShop });
    if (!foundShop) throw new BadRequestError("Error: Shop not resgistered");

    //2.
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("password mismatch");

    // 3.Create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      shop: getInforData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    console.log("signUp wwith: name, email,password", name, email, password);
    // try {
    // Step 1: Check if email exists in the database. Nếu email đã tồn tại, ném lỗi BadRequestError.

    const hodelShop = await shopModel.findOne({ email });
    if (hodelShop) {
      throw new BadRequestError("Error:Email already exists roi nhe");
      // return {
      //     code: "XXXX",
      //     message: "Email already exists",
      // };
    }

    // Step 2: Hash the password: Sử dụng bcrypt để băm mật khẩu của người dùng.
    const passwordHash = await bcrypt.hash(password, 10);

    // Step 3: Create new shop và Lưu thông tin người dùng vào cơ sở dữ liệu với roles mặc định là SHOP.
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    console.log({ newShop });

    //
    if (newShop) {
      // Step 4:Sử dụng crypto để tạo privateKey và publicKey.

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log("Generated RSA Key Pair:", { privateKey, publicKey });

      // Step 5: Gọi KeyTokenService.createKeyToken để lưu trữ thông tin publicKey và privateKey
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      console.log("Key stored:", keyStore);
      if (!keyStore) {
        return {
          code: "XXXX",
          message: "Error keyStore",
        };
      }

      // Step 6: Gọi createTokenPair để tạo token accessToken và refreshToken.
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
          shop: getInforData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    // } catch (error) {
    //     console.error("Error during signup:", error.message);
    //     return {
    //         code: "ERROR",
    //         message: error.message,
    //     };
    // }
  };
}

module.exports = AccessService;
