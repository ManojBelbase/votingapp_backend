import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"; // To handle CORS
import db from "./config/db.js"; // Assuming db.js handles your database connection
import userRouter from "./routes/user.route.js";
import candidateRouter from "./routes/candidate.route.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for cross-origin requests

// Routes setup
app.use("/api/user", userRouter); // Register user-related routes
app.use("/api/candidate", candidateRouter); // Register candidate-related routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
