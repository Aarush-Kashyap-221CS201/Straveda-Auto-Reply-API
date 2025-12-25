const express = require("express");
const {
  createNewAdmin,
  signup,
  login,
  createUser,
  getAllUsers,
  getUserById,
  deleteAllUsers,
  deleteUserById,
  updateUserById,
  suspendUser,
  activateUser,
  subscribeUser
} = require("../controllers/userController");

const adminAuth = require("../middlewares/adminAuth");
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

/* ============================
        AUTH ROUTES
============================ */
router.post("/signup", signup);
router.post("/login", login);

/* ============================
        ADMIN CRUD ROUTES
============================ */
router.post("/new-admin", adminAuth, createNewAdmin);
router.post("/", adminAuth, createUser);
router.get("/", adminAuth, getAllUsers);
router.get("/:id", userAuth, getUserById);
router.delete("/", adminAuth, deleteAllUsers);
router.delete("/:id", adminAuth, deleteUserById);
router.patch("/:id", adminAuth, updateUserById);
router.patch("/:id/subscribe", userAuth, subscribeUser);
router.patch("/:id/suspend", adminAuth, suspendUser);
router.patch("/:id/activate", adminAuth, activateUser);

module.exports = router;
