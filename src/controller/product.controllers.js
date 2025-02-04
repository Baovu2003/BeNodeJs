const ProductService = require("../services/product.services");
const { SuccessResponse } = require("../core/success.response");
class ProductController {
  createNewProduct = async (req, res, next) => {
    console.log("req.body", req.body);
    new SuccessResponse({
      message: "Create Product success",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
