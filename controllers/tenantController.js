const Tenant = require("../models/Tenant");

/* ============================
        CREATE TENANT
============================ */
const createTenant = async (req, res) => {
  try {
    const {
      name,
      location,
      description,
      adminId,
      maxStaffCount,
    } = req.body;

    if (!name || !location || !adminId || !maxStaffCount) {
      return res.status(400).json({
        error: "name, location, adminId and maxStaffCount are required",
      });
    }

    // 🔐 ownership check (standard pattern)
    if (
      req.user.role !== "admin" &&
      adminId !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const tenant = await Tenant.create({
      name: name.trim(),
      location: location.trim(),
      description: description?.trim() || "",
      adminId,
      maxStaffCount,
    });

    res.status(201).json(tenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ============================
        GET ALL TENANTS (ADMIN)
============================ */
const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find(); // ❌ no populate
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================
        GET TENANT BY ID
============================ */
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant)
      return res.status(404).json({ error: "Tenant not found" });

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      tenant.adminId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(tenant); // adminId returned as ObjectId
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        UPDATE TENANT
============================ */
const updateTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant)
      return res.status(404).json({ error: "Tenant not found" });

    // 🔐 ownership check
    if (
      req.user.role !== "admin" &&
      tenant.adminId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    Object.assign(tenant, req.body);
    await tenant.save();

    res.json(tenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ============================
        DELETE TENANT
============================ */
const deleteTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant)
      return res.status(404).json({ error: "Tenant not found" });

    // 🔐 ownership OR admin
    if (
      req.user.role !== "admin" &&
      tenant.adminId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await tenant.deleteOne();

    res.json({
      message: "Tenant deleted successfully",
      tenant,
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};

/* ============================
        DELETE ALL TENANTS
        (ADMIN ONLY)
============================ */
const deleteAllTenants = async (req, res) => {
  try {
    const result = await Tenant.deleteMany({});

    res.json({
      message: "All tenants deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenantById,
  deleteTenantById,
  deleteAllTenants,
};
