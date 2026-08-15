import express from "express";
import {
  getCodeFollowUp,
  gradeFollowUpAnswer,
  startInterview,
  submitAnswers,
  getResult,
  getAnalytics,
  getInterviewHistory,
  getInterviewById,
  saveCodingAttempt,
  getCodingHistory,
  getCodingAnalytics,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Specific/named routes — sab yaha, /:id se PEHLE
router.post("/start", protect, startInterview);
router.post("/submit/:id", protect, submitAnswers);
router.get("/result/:id", protect, getResult);
router.get("/analytics", protect, getAnalytics);
router.get("/history", protect, getInterviewHistory);
router.get("/history/:id", protect, getInterviewById);

router.post("/followup", protect, getCodeFollowUp);
router.post("/followup/grade", protect, gradeFollowUpAnswer);

router.post("/coding-attempt", protect, saveCodingAttempt);
router.get("/coding-history", protect, getCodingHistory);
router.get("/coding-analytics", protect, getCodingAnalytics);

// Generic /:id route — hamesha SABSE AAKHIR me
router.get("/:id", protect, getInterviewById);

export default router;