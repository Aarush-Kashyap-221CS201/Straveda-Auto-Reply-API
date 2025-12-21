const Template = require("../models/Template");

/* ============================
        CREATE TEMPLATE
============================ */
const createTemplate = async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ============================
        GET ALL TEMPLATES
============================ */
const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        GET TEMPLATES BY USER
============================ */
const getTemplatesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔐 Ownership check
    if (req.user.role !== "admin" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const templates = await Template.find({
      userId,
    }).sort({ createdAt: -1 });

    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
        GET TEMPLATE BY ID
============================ */
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template)
      return res.status(404).json({ error: "Template not found" });

    res.json(template);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        DELETE ALL TEMPLATES
============================ */
const deleteAllTemplates = async (req, res) => {
  try {
    const result = await Template.deleteMany({});
    res.json({
      message: "All templates deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        DELETE TEMPLATE BY ID
============================ */
const deleteTemplateById = async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Template not found" });

    res.json({ message: "Template deleted", template: deleted });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        UPDATE TEMPLATE BY ID
============================ */
const updateTemplateById = async (req, res) => {
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
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplatesByUser,
  getTemplateById,
  deleteAllTemplates,
  deleteTemplateById,
  updateTemplateById,
};
