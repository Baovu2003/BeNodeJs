"user strict";

const { findCartById } = require("../model/repository/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../model/repository/product.repo");
const { getDiscountAmount } = require("./discount.services");
class CheckoutService {
  // Login and without login
  /*
    {
        cartId,
        userId,
        shop_order_ids: [
          {
            shopId,
            shop_discount: [], // mảng chứa thông tin giảm giá áp dụng cho shop này
            item_products: [
              {
                productId,
                price,
                quantity
              }
            ]
          },
          {
            shopId,
            shop_discount: [
                {
                "shopId",
                "discountId",
                "codeId"
                }
            ], // mảng chứa thông tin giảm giá áp dụng cho shop này
            item_products: [
              {
                productId,
                price,
                quantity
              }
            ]
          }
        ]
      }
    */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart not exist");
    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shop_order_ids_new = [];

    //  Tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(item_products);
      console.log("checkProductServer", checkProductServer);
      if (!checkProductServer) throw new BadRequestError("Product not exist");

      // Tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      console.log("checkoutPrice", checkoutPrice);

      // Tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priveRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
      };
      console.log("itemCheckout", itemCheckout);

      console.log("------", userId, shopId, checkProductServer);
      if (shop_discounts.length > 0) {
        try {
          const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductServer,
          });

          console.log("discount", discount);

          checkout_order.totalDiscount += discount;
          if (discount > 0) {
            itemCheckout.priceApplyDiscount = checkoutPrice - discount;
          }
        } catch (error) {
          console.warn("Không áp dụng được mã giảm giá:", error.message);
        }

        // Tong thanh toan cuoi cung
      }
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;

      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        user_id,
        shop_order_ids,
      });

    // Flatmap
    const products = shop_order_ids.flatMap((order) => order.item_products);
    console.log("[1]: ", products);
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
    }
  }
}

module.exports = CheckoutService;
