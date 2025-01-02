import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String },
  mobile: { type: String },
  address: { type: String, required: true },
  voterId: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["voter", "admin"], default: "voter" },
  isVoted: { type: Boolean, default: false },
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
