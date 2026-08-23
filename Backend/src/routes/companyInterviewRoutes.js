import express from "express";
import {
	getCompanyInterviewOptions,
	startCompanyInterview,
	submitCompanyInterviewAnswers,
	getCompanyInterviewHistory,
	getCompanyInterviewResult,
	getCompanyInterviewAnalytics,
} from "../controllers/companyInterviewController.js";
import { protect } from "../middleware/authMiddleware.js"; // adjust path/name to match your existing auth middleware

const router = express.Router();

router.get("/options", protect, getCompanyInterviewOptions);           // GET  /api/company-interview/options
router.post("/start", protect, startCompanyInterview);                 // POST /api/company-interview/start
router.post("/:id/submit", protect, submitCompanyInterviewAnswers);    // POST /api/company-interview/:id/submit
router.get("/history", protect, getCompanyInterviewHistory);           // GET  /api/company-interview/history
router.get("/:id", protect, getCompanyInterviewResult);                // GET  /api/company-interview/:id
router.get("/analytics/summary", protect, getCompanyInterviewAnalytics); // GET /api/company-interview/analytics/summary

export default router;