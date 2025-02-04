"use strict";
const { product, electronic, clothing,furniture } = require("../model/product.model");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
// define factory class to create product
class ProductFactory {

    static productRegistry = {}; // key-class
    static registerproductType(type,classRef){   
      ProductFactory.productRegistry[type] = classRef;
    }
    static createProduct(type, payload) {
      const productClass = ProductFactory.productRegistry[type];
      if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);
      return new productClass(payload).createProduct();
    }
    

}
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
    return await product.create({...this, _id: productId});
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
}

// register product type

ProductFactory.registerproductType("Clothing", Clothing);
ProductFactory.registerproductType("Electronics", Electronics);
ProductFactory.registerproductType("Furniture", Furniture);

// usage example

module.exports = ProductFactory;
