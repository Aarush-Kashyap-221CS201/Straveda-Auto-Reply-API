const express = require("express");
const {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenantById,
  deleteTenantById,
  deleteAllTenants
} = require("../controllers/tenantController");

const adminAuth = require("../middlewares/adminAuth");
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

/* ============================
        ADMIN ROUTES
============================ */
router.get("/", adminAuth, getAllTenants);
router.delete("/", adminAuth, deleteAllTenants); 

/* ============================
        USER ROUTES (OWNERSHIP)
============================ */
router.post("/", userAuth, createTenant);
router.get("/:id", userAuth, getTenantById);
router.patch("/:id", userAuth, updateTenantById);
router.delete("/:id", userAuth, deleteTenantById);

module.exports = router;
