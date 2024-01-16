const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/full-auth");

const {
  addToCart,
  createOrder,
  emptyCart,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  getUserCart,
  updateOrderStatus,
} = require("../controllers/order.controller");

router.post("/cart", authenticateUser, addToCart);
router.post("/", authenticateUser, createOrder);
router.get("/cart", authenticateUser, getUserCart);
router.get("/current-order", authenticateUser, getCurrentUserOrders);
router.get("/", authenticateUser, authorizeRoles("admin"), getAllOrders);
router.get("/:id", authenticateUser, getSingleOrder);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  updateOrderStatus
);
router.delete("/empty-cart", authenticateUser, emptyCart);

module.exports = router;
