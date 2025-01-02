import express from "express";
import {
  Signup,
  Login,
  getProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { jwtAuthMiddleWare } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/profile", jwtAuthMiddleWare, getProfile);
router.put("/profile/password", jwtAuthMiddleWare, changePassword);

export default router;
