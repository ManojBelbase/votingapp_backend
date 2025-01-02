import express from "express";
import {
  createCandidate,
  deleteCandidate,
  getCandidates,
  updateCandidate,
  Vote,
  voteCount,
} from "../controllers/candidate.controller.js";
import { jwtAuthMiddleWare } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/create", jwtAuthMiddleWare, createCandidate);
router.put("/update/:candidateId", jwtAuthMiddleWare, updateCandidate);
router.delete("/delete/:candidateId", jwtAuthMiddleWare, deleteCandidate);
router.post("/vote/:candidateId", jwtAuthMiddleWare, Vote);
router.get("/vote/count", voteCount);
router.get("/get", getCandidates);

export default router;
