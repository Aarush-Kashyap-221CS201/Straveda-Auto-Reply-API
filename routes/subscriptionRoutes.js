const express = require("express");
const {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
  deleteAllSubscriptions,
} = require("../controllers/subscriptionController");

const adminAuth = require("../middlewares/adminAuth");
const userAuth = require("../middlewares/userAuth"); // or whatever you use for normal users

const router = express.Router();

/* ============================
        USER ROUTES
============================ */
router.get("/", userAuth, getAllSubscriptions);
router.get("/:id", userAuth, getSubscriptionById);

/* ============================
        ADMIN ROUTES
============================ */
router.post("/", adminAuth, createSubscription);
router.patch("/:id", adminAuth, updateSubscriptionById);
router.delete("/", adminAuth, deleteAllSubscriptions);
router.delete("/:id", adminAuth, deleteSubscriptionById);

module.exports = router;
