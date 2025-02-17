"use strict";
const { product, electronic, clothing, furniture } = require("../model/product.model");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
const { findAllDraftsShopRepo, findAllPublishedShopRepo, publisProductByShopRepo, unPublisProductByShopRepo, searchProducts, findAllProducts, findProductDetail, updateProductById } = require("../model/repository/product.repo");
const { removeUndefineObj, updateNestedObjectParser } = require("../untils");
const { insertInventory } = require("../model/repository/inventory.repo");
// define factory class to create product
class ProductFactory {

  static productRegistry = {}; // key-class
  static registerproductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);
    return new productClass(payload).createProduct();
  }
  static updateProduct(type,productId, payload) {
    console.log("Payload received:", payload);  // Thêm dòng này để debug
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);
    return new productClass(payload).updateProduct(productId);
  }

  // PUT ///
  static async publishProductByShop({ product_shop, product_id }) {
    return publisProductByShopRepo({ product_shop, product_id })
  }
  static async unPublisProductByShop({ product_shop, product_id }) {
    return unPublisProductByShopRepo({ product_shop, product_id })
  }
  // END PUT//


  // query //

  static async findAllDraftsShopService({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsShopRepo({ query, limit, skip })
  }

  static async findAllPublishedShopService({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    console.log(query);
    return await findAllPublishedShopRepo({ query, limit, skip })
  }

  static async getListSearchProducts({ keySearch }) {
    return await searchProducts({ keySearch })
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({
      limit, sort, page, filter,
      select: ['product_name', 'product_price', 'product_thumb'],
    })
  }

  static async findProductDetail({ product_id }) {
    return await findProductDetail({ product_id: product_id, unSelect: ['__v', 'product_variations'] })
  }


}

// end query //




// definE BASE  product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(productId) {
    const newproduct= await product.create({ ...this, _id: productId });

    if(newproduct){
      console.log(newproduct)
      await insertInventory({
        productId: newproduct._id,
        shopId: this.product_shop,
        stock:this.product_quantity,
      })
    }
    return newproduct;
  }
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({productId, bodyUpdate,model:product});
  }
}

// define sub-class for different producrt type Clothing
class Clothing extends Product {
  async createProduct() {
    console.log("Product Attributes before saving to clothing:", this.product_attributes);
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct(newCothing._id);
    if (!newProduct) throw new BadRequestError("Create new producrt error");
    return newProduct;
  }

  async updateProduct(productId) {

    const objectParams = this;
    if (objectParams.product_attributes) {
      //  update child
      await updateProductById({productId, objectParams,model:clothing});
    } else {

    }
    const updatedProduct = await super.updateProduct(productId, objectParams);
    return updatedProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new Electronic error");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new producrt error");
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestError("Create new Furniture error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new producrt error");
    return newProduct;
  }
  async updateProduct(productId) {

    console.log("this ban dau",this)
    
    const objectParams = removeUndefineObj(this);
    console.log("this sau khi remove null",objectParams)

    if (objectParams.product_attributes) {
      //  update child
      await updateProductById({productId,
         bodyUpdate:updateNestedObjectParser(objectParams.product_attributes),
         model:furniture});
    } else {

    }
    const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updatedProduct;
  }
}

// register product type

ProductFactory.registerproductType("Clothing", Clothing);
ProductFactory.registerproductType("Electronics", Electronics);
ProductFactory.registerproductType("Furniture", Furniture);

// usage example

module.exports = ProductFactory;
