// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./src/auth/authRoutes");
const profileRoutes = require("./src/profile/profileRoutes");
const messageRoutes = require("./src/messages/messageRoutes");
// Import the user routes
const userRoutes = require("./src/users/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/messages", messageRoutes);
// Register the users endpoint
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
