const ProductService = require("../services/product.services");
const ProductServiceV2 = require("../services/product.services_version2");
const { SuccessResponse } = require("../core/success.response");
class ProductController {
  createNewProduct = async (req, res, next) => {
    console.log("req.body ben product-controller", req.body);
    // new SuccessResponse({
    //   message: "Create Product success",
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);


     new SuccessResponse({
      message: "Create Product success",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);


  };
}

module.exports = new ProductController();
