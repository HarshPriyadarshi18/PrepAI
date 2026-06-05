import express from "express";

import { protect }
from "../middleware/authmiddleware.js";

import upload
from "../middleware/uploadMiddleware.js";

import {
 uploadResume,
  analyzeResume,
  getResumeById,

  getMyResume,
  getResumes
}
from "../controllers/resumeController.js";

const router = express.Router();

router.get("/", protect, getResumes);  // ← add this
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get("/my", protect, getMyResume);
router.post(
  "/analyze/:id",
  protect,
  analyzeResume
);

router.get(
  "/:id",
  protect,
  getResumeById
);
export default router;