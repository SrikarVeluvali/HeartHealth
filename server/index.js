import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express(); // Create an instance of Express

dotenv.config();
const PORT = process.env.PORT || 9000; // Define the port
connectDB(); // Connect to MongoDB

app.use(cors()); // Enable Cross-Origin Resource Sharing

app.use(express.json()); // Parse incoming JSON requests

app.get("/", (req, res) => {
  res.send("Welcome to the Heart Health Project by G114.");
});

// Routes
app.use("/api/auth", authRoutes); // Mount auth routes under /api/auth

app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
