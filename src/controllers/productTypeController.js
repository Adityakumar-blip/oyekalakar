const express = require("express");
const mongoose = require("mongoose");
const ProductType = require("../models/productTypeSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

exports.createProductType = async (req, res, next) => {
  try {
    const { typeName } = req.body;
    const productType = new ProductType({ typeName });
    await productType.save();
    sendSuccess(res, "ProductType created successfully", productType, 201);
  } catch (error) {
    sendError(res, "Failed to create ProductType", error, 500);
  }
};

exports.getAllProductType = async (req, res, next) => {
  try {
    const productTypes = await ProductType.find();
    sendSuccess(res, "ProductTypes retrieved successfully", productTypes);
  } catch (error) {
    sendError(res, "Failed to retrieve ProductTypes", error, 500);
  }
};

exports.updateProductType = async (req, res, next) => {
  try {
    const { typeName, status } = req.body;
    const productType = await ProductType.findByIdAndUpdate(
      req.params.id,
      { typeName, status },
      { new: true }
    );
    if (!productType) return sendError(res, "ProductType not found", null, 404);
    sendSuccess(res, "ProductType updated successfully", productType);
  } catch (error) {
    sendError(res, "Failed to update ProductType", error, 500);
  }
};

exports.getProductTypeById = async (req, res, next) => {
  try {
    const productType = await ProductType.findById(req.params.id);
    if (!productType) return sendError(res, "ProductType not found", null, 404);
    sendSuccess(res, "ProductType retrieved successfully", productType);
  } catch (error) {
    sendError(res, "Failed to retrieve ProductType", error, 500);
  }
};

exports.deleteProductType = async (req, res, next) => {
  try {
    const productType = await ProductType.findByIdAndDelete(req.params.id);
    if (!productType) return sendError(res, "ProductType not found", null, 404);
    sendSuccess(res, "ProductType deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete ProductType", error, 500);
  }
};


