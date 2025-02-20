const mongoose = require("mongoose");
const ProductType = require("../config/productTypeEnum");
const ROLES = require("../config/roleEnum");
const STATUS = require("../config/statusEnum");
const {
  CustomizationType,
  CustomizationOptions,
} = require("../config/ProductEnum");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    productType: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
    basePrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    productSeller: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roles",
      required: true,
    },
    roles: { type: String, enum: Object.values(ROLES), required: true },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
    },
    images: [{ url: String, public_id: String }],
    tags: [{ type: String }],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      reviews: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          rating: { type: Number, required: true, min: 1, max: 5 },
          comment: String,
        },
      ],
    },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

    customizationOptions: {
      type: [
        {
          type: {
            type: String,
            enum: Object.values(CustomizationType),
            required: true,
          },
          options: [
            {
              name: {
                type: String,
                required: true,
              },
              price: { type: Number, required: true, min: 0 },
            },
          ],
        },
      ],
      default: undefined,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
