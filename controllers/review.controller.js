const { Reviews } = require("../models/review.model");
const { Products } = require("../models/product.model");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const rateProduct = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const product = await Products.findById(productId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.stars": stars, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Products.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              stars: stars,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getAllRatings = await Products.findById(productId);
    let totalRatings = getAllRatings.ratings.length;
    let ratingsSum = getAllRatings.ratings
      .map((item) => item.stars)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRatings = Math.random(ratingsSum / totalRatings);
    let finalRatings = await Products.findByIdAndUpdate(
      productId,
      {
        totalRatings: actualRatings,
      },
      {
        new: true,
      }
    );
    res.status(StatusCodes.OK).json(finalRatings);
  } catch (error) {
    throw new CustomError.BadRequestError(error);
  }
};
