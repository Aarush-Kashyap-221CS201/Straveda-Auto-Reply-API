const Subscription = require("../models/Subscription");

/* ============================
   CREATE SUBSCRIPTION (ADMIN)
============================ */
const createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json(subscription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ============================
   GET ALL SUBSCRIPTIONS (USER)
============================ */
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
   GET SUBSCRIPTION BY ID (USER)
============================ */
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription)
      return res.status(404).json({ error: "Subscription not found" });

    res.json(subscription);
  } catch (err) {
    res.status(400).json({ error: "Invalid subscription ID" });
  }
};

/* ============================
   UPDATE SUBSCRIPTION (ADMIN)
============================ */
const updateSubscriptionById = async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Subscription not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ============================
   DELETE SUBSCRIPTION BY ID (ADMIN)
============================ */
const deleteSubscriptionById = async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Subscription not found" });

    res.json({ message: "Subscription deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid subscription ID" });
  }
};

/* ============================
   DELETE ALL SUBSCRIPTIONS (ADMIN)
============================ */
const deleteAllSubscriptions = async (req, res) => {
  try {
    await Subscription.deleteMany();
    res.json({ message: "All subscriptions deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
  deleteAllSubscriptions,
};
