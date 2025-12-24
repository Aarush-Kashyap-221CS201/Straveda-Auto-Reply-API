const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors"); // ✅ ADD

const app = express();

/* ✅ ADD THIS BLOCK (must be before routes) */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
/* --------------------------------------- */

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const templateRoutes = require("./routes/templateRoutes");
app.use("/templates", templateRoutes);

const scheduleRoutes = require("./routes/scheduleRoutes");
app.use("/schedules", scheduleRoutes);

const subscriptionRoutes = require("./routes/subscriptionRoutes");
app.use("/subscriptions", subscriptionRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
