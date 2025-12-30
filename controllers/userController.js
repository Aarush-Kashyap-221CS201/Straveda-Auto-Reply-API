const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");
const Tenant = require("../models/Tenant");

/* ============================
      CREATE NEW ADMIN
============================ */
const createNewAdmin = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();

    // Check duplicate username
    const existing = await User.findOne({ username: normalizedUsername });
    if (existing) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Force admin role
    const admin = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      password: passwordHash,
      role: "admin",
    });

    // Issue token for the new admin
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
        SIGNUP
============================ */
const signup = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const existing = await User.findOne({ username: normalizedUsername });
    if (existing) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      password: passwordHash,
      role: "user", // ✅ default role
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
        LOGIN
============================ */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await User.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        CREATE USER
============================ */
const createUser = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      role: req.body.role || "user",
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/* ============================
        GET ALL USERS
============================ */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortKey = "createdAt",
      sortOrder = "desc",
      search = "",
      role,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    /* =========================
       FILTER
    ========================= */

    const filter = {};

    // role filter (user/admin)
    if (role) {
      filter.role = role;
    }

    // search by name or username
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    /* =========================
       SORT
    ========================= */

    const sort = {
      [sortKey]: sortOrder === "asc" ? 1 : -1,
    };

    /* =========================
       QUERY
    ========================= */

    const query = User.find(filter).sort(sort);

    if (limitNum > 0) {
      query.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const users = await query;
    const total = await User.countDocuments(filter);

    res.json({
      users,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        GET USER BY ID
============================ */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      user._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        DELETE ALL USERS
============================ */
const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({
      message: "All users deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        DELETE USER BY ID
============================ */
const deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted", user: deleted });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        UPDATE USER BY ID
============================ */
const updateUserById = async (req, res) => {
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
};

const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ error: "User not found" });

    // 🚫 Do not allow suspending admins
    if (user.role === "admin") {
      return res.status(403).json({
        error: "Admin users cannot be suspended",
      });
    }

    user.isSuspended = true;
    await user.save();

    res.json({
      message: "User suspended successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ error: "User not found" });

    // 🚫 Do not allow activating admins (meaningless operation)
    if (user.role === "admin") {
      return res.status(403).json({
        error: "Admin users cannot be activated or deactivated",
      });
    }

    user.isSuspended = false;
    await user.save();

    res.json({
      message: "User activated successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/* ============================
   SUBSCRIBE USER
============================ */
const subscribeUser = async (req, res) => {
  try {
    const { subscriptionId, subscriptionTerm } = req.body;

    if (!subscriptionId || !subscriptionTerm) {
      return res.status(400).json({
        error: "subscriptionId and subscriptionTerm are required",
      });
    }

    if (!["monthly", "yearly"].includes(subscriptionTerm)) {
      return res.status(400).json({
        error: "Invalid subscription term",
      });
    }

    // ✅ Check subscription exists
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        error: "Subscription not found",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      user._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    /* ============================
       CALCULATE VALIDITY
    ============================ */
    const validFrom = new Date();
    const validTill = new Date(validFrom);

    if (subscriptionTerm === "monthly") {
      validTill.setMonth(validTill.getMonth() + 1);
    } else {
      validTill.setFullYear(validTill.getFullYear() + 1);
    }

    /* ============================
       CREATE PAYMENT
    ============================ */
    const amount =
      subscriptionTerm === "monthly"
        ? subscription.monthlyPrice
        : subscription.yearlyPrice;

    const payment = await Payment.create({
      userId: user._id,
      subscriptionId: subscription._id,
      subscriptionName: subscription.name,
      term: subscriptionTerm,
      validFrom,
      validTill,
      amount,
    });

    /* ============================
       UPDATE USER
    ============================ */
    user.subscriptionId = subscriptionId;
    user.subscriptionTerm = subscriptionTerm;
    user.validTill = validTill;

    await user.save();

    res.json({
      message: "Subscription updated successfully",
      user,
      payment,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ============================
   ADD TENANT TO USER
============================ */
const addTenantToUser = async (req, res) => {
  try {
    const { tenantId, username, isTenantAdmin = false } = req.body;

    if (!tenantId || !username) {
      return res.status(400).json({
        error: "tenantId and username are required",
      });
    }

    /* ============================
       CHECK USER (BY USERNAME)
    ============================ */
    const user = await User.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    // 🚫 already assigned
    if (user.tenantId) {
      return res.status(400).json({
        error: "User already belongs to a tenant",
      });
    }

    /* ============================
       CHECK TENANT
    ============================ */
    const tenant = await Tenant.findById(tenantId);
    if (!tenant)
      return res.status(404).json({ error: "Tenant not found" });

    // 🔐 tenant ownership check
    if (
      req.user.role !== "admin" &&
      tenant.adminId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // 🚫 staff limit check
    if (tenant.currentStaffCount >= tenant.maxStaffCount) {
      return res.status(400).json({
        error: "Tenant staff limit reached",
      });
    }

    /* ============================
       UPDATE USER
    ============================ */
    user.tenantId = tenantId;
    user.isTenantAdmin = Boolean(isTenantAdmin);
    await user.save();

    /* ============================
       UPDATE TENANT STAFF COUNT
    ============================ */
    tenant.currentStaffCount += 1;
    await tenant.save();

    res.json({
      message: "Tenant added to user successfully",
      user,
      tenant,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




module.exports = {
  createNewAdmin,
  signup,
  login,
  createUser,
  getAllUsers,
  getUserById,
  deleteAllUsers,
  deleteUserById,
  updateUserById,
  suspendUser,
  activateUser,
  subscribeUser,
  addTenantToUser
};
