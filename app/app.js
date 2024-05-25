const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const connectDB = require("./database/connection");
const userRoutes = require("./routes/user.routes");
const route = require("./routes/route.routes");
const roleRoutes = require("./routes/role.routes");

app.use(cors());
app.use(express.json());
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/routes", route);
app.use("/api/roles", roleRoutes);

module.exports = app;
