/*

-add product to cart [user]
-reduce product quan tity by one [user]
-increare product quantoty by one[user]
-get cart[user]
Delete [cart]
-Delete cart Item[user]

*/
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { cart } = require("../model/cart.model");

const { getProductById } = require("../model/repository/product.repo");

class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: "active" };
      
        const updateOrInsert = {
          $addToSet: {
            cart_products: product, // Đảm bảo tên trường là `cart_products`
          },
        };
      
        const options = { upsert: true, new: true };
      
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
      }
      
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        // Kiểm tra xem productId có trong giỏ hàng không.
        "cart_products.productId": productId,
        //  Chỉ cập nhật nếu giỏ hàng đang ở trạng thái "active"
        cart_state: "active",
      },
      updateSet = {
        // $inc: Toán tử MongoDB giúp tăng hoặc giảm số lượng
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  static async addTocart({ userId, product = {} }) {
    //add product to cart
    console.log({ userId, product });
    const userCart = await cart.findOne({ cart_userId: userId });
    console.log(userCart)
    if (!userCart) {
      //   create cart for User
    }

    // co gio hang nhung chua cos san pham
    if (userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // cos gio hang roi va co san pham ori thi update quantity and money
  }

  // Update cart
  // shop_orders_ids:[
  //     {
  //         shopId,
  //         item_product:[
  //             {
  //                 quantity,
  //                 price,
  //                 shopId,
  //                 old_quantity,
  //                 quantity,
  //                 productId
  //             },
  //              version
  //         ]
  //     }
  // ]
  static async addToCarV2({ userId, shop_order_ids = {} }) {
    console.log( userId, shop_order_ids)
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
      console.log("productId,quantity,old_quantity",productId,quantity,old_quantity)
    const foundProduct = await getProductById(productId);
    console.log("foundProduct",foundProduct)
    console.log(shop_order_ids[0])
    if (!foundProduct) {
      throw new NotFoundError("product not found");
    }
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("you can't add product to cart");
    }
    if (quantity === 0) {
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }
  static async deleteUserCart({ userId, productId }) {
    const query = {cart_userId:userId, cart_state:"active"};
    const updateSet = {
        $pull: { cart_products: {
            productId
        } },   
    }

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;


    // const foundProduct = await getProductById(productId);
    // if (!foundProduct) {
    //   throw new NotFoundError("product not found");
    // }
    // return await CartService.deleteUserCart({
    //   userId,
    //   productId,
    // });
  }

  static async getListUsercart({userId}){
    return await cart.findOne({
        cart_userId:userId,
    })
  }
}

module.exports = CartService;
