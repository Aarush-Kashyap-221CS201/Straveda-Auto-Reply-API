const express = require("express");
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
  deleteAllPayments,
} = require("../controllers/paymentController");

const adminAuth = require("../middlewares/adminAuth");
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

/* ============================
        USER ROUTES
============================ */
router.post("/", userAuth, createPayment);

/* ============================
        ADMIN ROUTES
============================ */
router.get("/", adminAuth, getAllPayments);
router.get("/:id", adminAuth, getPaymentById);
router.patch("/:id", adminAuth, updatePaymentById);
router.delete("/", adminAuth, deleteAllPayments);
router.delete("/:id", adminAuth, deletePaymentById);

module.exports = router;
