import express from "express";
import {
  getCodeFollowUp,
  gradeFollowUpAnswer,
} from "../controllers/interviewController.js";
import {
startInterview,
submitAnswers,
getResult,
getAnalytics,
getInterviewHistory,
getInterviewById
}
from "../controllers/interviewController.js";

import { protect }
from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
"/start",
protect,
startInterview
);

router.post(
"/submit/:id",
protect,
submitAnswers
);

router.get(
"/result/:id",
protect,
getResult
);
router.get(
  "/analytics",
  protect,
  getAnalytics
);
router.post("/followup", protect, getCodeFollowUp);
router.post("/followup/grade", protect, gradeFollowUpAnswer);
router.get(
  "/history",
  protect,
  getInterviewHistory
);

router.get(
  "/history/:id",
  protect,
  getInterviewById
);


export default router;