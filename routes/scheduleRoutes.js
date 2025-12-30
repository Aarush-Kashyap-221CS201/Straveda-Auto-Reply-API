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
        CREATE
        (USER / ADMIN)
============================ */
router.post("/", userAuth, createSchedule);

/* ============================
        READ
============================ */
router.get("/", adminAuth, getAllSchedules);

// ⚠️ must come BEFORE "/:id"
router.get("/user/:userId" /*,userAuth*/, getSchedulesByUser);

router.get("/:id", userAuth, getScheduleById);

/* ============================
        DELETE
============================ */
router.delete("/", adminAuth, deleteAllSchedules);
router.delete("/:id", userAuth, deleteScheduleById);

/* ============================
        UPDATE
============================ */
router.patch("/:id"/*, userAuth*/, updateScheduleById);

module.exports = router;
