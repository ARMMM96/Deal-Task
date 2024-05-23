const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const connectDB = require("./database/connection");

app.use(cors());

connectDB();

module.exports = app;
