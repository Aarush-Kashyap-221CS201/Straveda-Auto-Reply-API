const Payment = require("../models/Payment");

/* ============================
   CREATE PAYMENT (USER)
============================ */
const createPayment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/* ============================
   GET ALL PAYMENTS (ADMIN)
============================ */
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
   GET PAYMENT BY ID (ADMIN)
============================ */
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment)
      return res.status(404).json({ error: "Payment not found" });

    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: "Invalid payment ID" });
  }
};

/* ============================
   UPDATE PAYMENT (ADMIN)
============================ */
const updatePaymentById = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Payment not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ============================
   DELETE PAYMENT BY ID (ADMIN)
============================ */
const deletePaymentById = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Payment not found" });

    res.json({ message: "Payment deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid payment ID" });
  }
};

/* ============================
   DELETE ALL PAYMENTS (ADMIN)
============================ */
const deleteAllPayments = async (req, res) => {
  try {
    await Payment.deleteMany();
    res.json({ message: "All payments deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
  deleteAllPayments,
};
