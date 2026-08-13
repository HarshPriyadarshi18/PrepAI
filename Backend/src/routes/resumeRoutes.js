import express from "express";

import { protect } from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadResume,
  analyzeResume,
  getMyResume,
  getResumes,
  getResumeById,
  matchResume,
  rewriteBullets,
  generateMockInterview,
  optimizeResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.get("/", protect, getResumes);
router.get("/my", protect, getMyResume);
router.get("/:id", protect, getResumeById);

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.post(
  "/analyze/:id",
  protect,
  analyzeResume
);

router.post(
  "/match",
  protect,
  matchResume
);

router.post(
  "/rewrite-bullets",
  protect,
  rewriteBullets
);

router.post(
  "/mock-interview",
  protect,
  generateMockInterview
);

router.post(
  "/optimize",
  protect,
  optimizeResume
);

export default router;