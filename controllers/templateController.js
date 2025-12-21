const Schedule = require("../models/Schedule");
const Template = require("../models/Template");

/* ============================
        CREATE TEMPLATE
        (USER / ADMIN)
============================ */
const createTemplate = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      req.user.userId !== userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const template = await Template.create(req.body);
    res.json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/* ============================
        GET ALL TEMPLATES
        (ADMIN ONLY – unchanged)
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

    // 🔐 ownership check
    if (req.user.role !== "admin" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const templates = await Template.find({ userId }).sort({
      createdAt: -1,
    });

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

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      template.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(template);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        DELETE ALL TEMPLATES
        (ADMIN ONLY)
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
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      template.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // 🚫 check if template is used in any schedule
    const usedInSchedule = await Schedule.exists({
      templateId: template._id,
    });

    if (usedInSchedule) {
      return res.status(400).json({
        error: "Template is used in a schedule and cannot be deleted",
      });
    }

    await template.deleteOne();

    res.json({
      message: "Template deleted",
      template,
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};


/* ============================
        UPDATE TEMPLATE BY ID
============================ */
const updateTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template)
      return res.status(404).json({ error: "Template not found" });

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      template.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    Object.assign(template, req.body);
    await template.save();

    res.json(template);
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
