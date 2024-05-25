const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const connectDB = require("./database/connection");
const userRoutes = require('./routes/user.routes');

app.use(cors());
app.use(express.json())
connectDB();

// Routes
app.use('/api/users', userRoutes);


module.exports = app;
