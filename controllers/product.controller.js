const { Products } = require("../models/product.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  try {
    const product = await Products.create(req.body);
    res.status(StatusCodes.OK).json({ product, productId: product._id });
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
  const { id: productId } = req.params;
  const product = await Products.findOne({ id: productId }).populate("reviews");

  if (!product) {
    throw new CustomError.notFoundError(
      `No product with this id: ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product, count });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Products.findOneAndUpdate({ id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.notFoundError(
      `No product with this id: ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Products.findOneAndDelete({ id: productId });
  if (!product) {
    throw new CustomError.notFoundError(
      `No product with this id: ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: "Product deleted" });
};

const uploadProductImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No files uploaded");
  }

  const productImage = req.files.image;
  if (!productImage.mimeType.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  const imagePath = path.join(
    __dirname,
    "../assets/images" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res
    .status(StatusCodes.OK)
    .json({
      msg: "Product image uploaded",
      image: `../assests/images/${productImage.name}`,
    });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
