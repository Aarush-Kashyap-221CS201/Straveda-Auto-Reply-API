const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* ============================
        CREATE (POST)
============================ */
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ============================
        READ ALL (GET /)
============================ */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
        READ ONE (GET /:id)
============================ */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

/* ============================
        DELETE ALL (DELETE /)
============================ */
router.delete("/", async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({
      message: "All users deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
        DELETE ONE (DELETE /:id)
============================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted", user: deleted });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

/* ============================
        UPDATE ONE (PATCH /:id)
============================ */
router.patch("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: "User not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
