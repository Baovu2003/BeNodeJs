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

  updateProduct= async (req, res,next) => {
    new SuccessResponse({
      message: "Update Product success",
      metadata: await ProductServiceV2.updateProduct(req.body.product_type,req.params.productId, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  updatePublishedProductByShop = async (req,res,next) =>{
    new SuccessResponse({
      message: "Updated Product success",
      metadata: await ProductServiceV2.publishProductByShop({       
        product_shop: req.user.userId,
        product_id: req.params.id
      }),
    }).send(res);
  }
  
  unPublisProductByShop = async (req,res,next) =>{
    new SuccessResponse({
      message: "Updated Product success",
      metadata: await ProductServiceV2.unPublisProductByShop({       
        product_shop: req.user.userId,
        product_id: req.params.id
      }),
    }).send(res);
  }

  getAllDrafsShop = async (req, res, next) => {
    console.log("req.body ben product-controller", req.body);
    // new SuccessResponse({
    //   message: "Create Product success",
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);
     new SuccessResponse({
      message: "Get All Product success",
      metadata: await ProductServiceV2.findAllDraftsShopService({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedShop = async (req, res, next) => {
    console.log("req.body ben product-controller", req.body);
     new SuccessResponse({
      message: "Get getAllPublishedShop success",
      metadata: await ProductServiceV2.findAllPublishedShopService({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  searchProductShop = async (req, res, next) => {
    console.log("req.body ben product-controller", req.body);
     new SuccessResponse({
      message: "Search success",
      metadata: await ProductServiceV2.getListSearchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    console.log("req.body ben product-controller", req.body);
     new SuccessResponse({
      message: "getAllProduct success",
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  };

  findProductDetail = async (req, res, next) => {
    console.log("req.body ben product-controller", req.body);
     new SuccessResponse({
      message: "get Detail Product success",
      metadata: await ProductServiceV2.findProductDetail({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
