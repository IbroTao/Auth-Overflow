const { Orders } = require("../models/order.model");
const { Products } = require("../models/product.model");
const { Carts } = require("../models/cart.model");
const { Users } = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions, validateMongoId } = require("../utils");

const addToCart = async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);

  let products = [];
  const user = await Users.findById(_id);

  const cartAlreadyExists = await Carts.findOne({ orderBy: user._id });
  if (cartAlreadyExists) {
    cartAlreadyExists.remove();
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    let getPrice = await Products.findOne(cart[i]._id).select("price").exec();
    object.price = getPrice.price;
    products.push(object);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * product[i].count;
  }
  let newCart = new Carts.create({
    products,
    cartTotal,
    orderBy: user._id,
  }).save();
  res.status(StatusCodes.OK).json({ cart: newCart });
};

const getUserCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const cart = await Users.findOne({ orderBy: user._id }).populate(
      "products.product"
    );
    if (!cart) {
      throw new CustomError.notFoundError("This user has no cart");
    }
    res.status(StatusCodes.OK).json({ cart: cart });
  } catch (error) {
    throw new CustomError.BadRequestError(error);
  }
};

const emptyCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const user = await Users.findOne({ _id });
    const cart = await Carts.findOneAndRemove({ orderBy: user._id });
    res.status(StatusCodes.OK).json({ message: "Cart emptied" });
  } catch (error) {
    throw new CustomError.BadRequestError(error);
  }
};

const createOrder = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  const { tax, shippingFee } = req.body;
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }
};

module.exports = {
  emptyCart,
  addToCart,
  getUserCart,
  createOrder,
};
