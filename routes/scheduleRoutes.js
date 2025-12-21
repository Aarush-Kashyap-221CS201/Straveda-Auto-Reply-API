const express = require("express");
const {
  createSchedule,
  getAllSchedules,
  getSchedulesByUser,
  getScheduleById,
  deleteAllSchedules,
  deleteScheduleById,
  updateScheduleById,
} = require("../controllers/scheduleController");

const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

/* ============================
        CREATE (ADMIN)
============================ */
router.post("/", adminAuth, createSchedule);

/* ============================
        READ
============================ */
router.get("/", adminAuth, getAllSchedules);

// ⚠️ must come BEFORE "/:id"
router.get("/user/:userId", userAuth, getSchedulesByUser);

router.get("/:id", adminAuth, getScheduleById);

/* ============================
        DELETE (ADMIN)
============================ */
router.delete("/", adminAuth, deleteAllSchedules);
router.delete("/:id", adminAuth, deleteScheduleById);

/* ============================
        UPDATE (ADMIN)
============================ */
router.patch("/:id", adminAuth, updateScheduleById);

module.exports = router;
