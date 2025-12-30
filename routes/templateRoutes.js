const express = require("express");
const {
  createTemplate,
  getAllTemplates,
  getTemplatesByUser,
  getTemplateById,
  deleteAllTemplates,
  deleteTemplateById,
  updateTemplateById,
} = require("../controllers/templateController");

const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

/* ============================
        CREATE
        (USER / ADMIN)
============================ */
router.post("/", userAuth, createTemplate);

/* ============================
        READ
============================ */
router.get("/", adminAuth, getAllTemplates);

// ⚠️ must come BEFORE "/:id"
router.get("/user/:userId" /*,userAuth*/, getTemplatesByUser);

router.get("/:id", userAuth, getTemplateById);

/* ============================
        DELETE
============================ */
router.delete("/", adminAuth, deleteAllTemplates);
router.delete("/:id", userAuth, deleteTemplateById);

/* ============================
        UPDATE
============================ */
router.patch("/:id", userAuth, updateTemplateById);

module.exports = router;
