const Schedule = require("../models/Schedule");

/* ============================
        CREATE SCHEDULE
        (USER / ADMIN)
============================ */
const createSchedule = async (req, res) => {
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

    const schedule = await Schedule.create(req.body);
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ============================
        GET ALL SCHEDULES
        (ADMIN ONLY)
============================ */
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        GET SCHEDULES BY USER
============================ */
const getSchedulesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    /*
    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      req.user.userId !== userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }
    */

    const schedules = await Schedule.find({ userId }).sort({
      startDate: 1,
    });

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        GET SCHEDULE BY ID
============================ */
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule)
      return res.status(404).json({ error: "Schedule not found" });

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      schedule.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(schedule);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        DELETE ALL SCHEDULES
        (ADMIN ONLY)
============================ */
const deleteAllSchedules = async (req, res) => {
  try {
    const result = await Schedule.deleteMany({});
    res.json({
      message: "All schedules deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        DELETE SCHEDULE BY ID
============================ */
const deleteScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule)
      return res.status(404).json({ error: "Schedule not found" });

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      schedule.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await schedule.deleteOne();

    res.json({ message: "Schedule deleted", schedule });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        UPDATE SCHEDULE BY ID
============================ */
const updateScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule)
      return res.status(404).json({ error: "Schedule not found" });

    /*
    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      schedule.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }
    */

    Object.assign(schedule, req.body);
    await schedule.save();

    res.json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getSchedulesByUser,
  getScheduleById,
  deleteAllSchedules,
  deleteScheduleById,
  updateScheduleById,
};
