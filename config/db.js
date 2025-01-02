import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// const mongoURL = process.env.MONGODB_URL_LOCAL; // for local
const mongoURL = process.env.MONGODB_URL_GLOBAL;
// setup mongodb connection
mongoose.connect(mongoURL);

const db = mongoose.connection;

// event listiners
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

export default db;
