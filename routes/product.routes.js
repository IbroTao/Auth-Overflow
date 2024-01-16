const express = require("express");
const router = express.Router();

const { rateProduct } = require("../controllers/review.controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/full-auth");
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadProductImage,
} = require("../controllers/product.controller");

router
  .route("/")
  .post(authenticateUser, authorizeRoles("admin"), createProduct)
  .get(authenticateUser, getAllProducts);

router
  .route("/:id")
  .put(authenticateUser, authorizeRoles("admin"), updateProduct)
  .delete(authenticateUser, authorizeRoles("admin"), deleteProduct)
  .get(authenticateUser, getSingleProduct);

router.route("/rate").put(authenticateUser, rateProduct);

router
  .route("/upload")
  .post(authenticateUser, authorizeRoles("admin"), uploadProductImage);
module.exports = router;
