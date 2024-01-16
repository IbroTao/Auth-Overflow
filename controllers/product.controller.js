const { Products } = require("../models/product.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  try {
    const product = await Products.create(req.body);
    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    throw new CustomError.BadRequestError(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length });
  } catch (error) {
    throw new CustomError.BadRequestError(error);
  }
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = re.params;
  const product = await Products.findOne({ _id: productId }).populate(
    "reviews"
  );

  if (!product) {
    throw new CustomError.notFoundError(
      `NO product with this id: ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product, count });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
};
