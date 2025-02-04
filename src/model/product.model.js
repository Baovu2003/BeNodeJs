"use strict";

const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: "string", required: true },
    product_thumb: { type: "string", required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: "string",
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// define the product type= clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

// define the product type= electronics
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: "electronic",
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    manufacturer: { type: String, required: true }, // Nhà sản xuất
    model: String, // Model của nội thất
    color: String, // Màu sắc
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" }, // Liên kết với shop bán
  },
  {
    collection: "furniture",
    timestamps: true,
  }
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema), // Model tổng quát cho sản phẩm
    electronic: model("Electronic", electronicSchema), // Model cho sản phẩm điện tử
    clothing: model("Clothing", clothingSchema), // Model cho sản phẩm quần áo
    furniture: model("Furniture", furnitureSchema), // Model cho sản phẩm nội thất
  };
  