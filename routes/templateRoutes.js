const express = require("express");
const Template = require("../models/Template");

const router = express.Router();

/* ============================================
        CREATE TEMPLATE (POST /)
============================================ */
router.post("/", async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ============================================
        GET ALL TEMPLATES (GET /)
============================================ */
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
        GET ONE TEMPLATE (GET /:id)
============================================ */
router.get("/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template)
      return res.status(404).json({ error: "Template not found" });

    res.json(template);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

/* ============================================
        DELETE ALL (DELETE /)
============================================ */
router.delete("/", async (req, res) => {
  try {
    const result = await Template.deleteMany({});
    res.json({
      message: "All templates deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
        DELETE ONE TEMPLATE (DELETE /:id)
============================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Template not found" });

    res.json({ message: "Template deleted", template: deleted });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

/* ============================================
        UPDATE TEMPLATE (PATCH /:id)
============================================ */
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Template not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
