const express = require("express");
const routes = require("./routes");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Mount routes
app.use("/api", routes);

module.exports = app;
