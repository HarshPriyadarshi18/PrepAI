import express from "express";

import { protect } from "../middleware/authmiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import {
<<<<<<< HEAD
 uploadResume,
  analyzeResume,
  getResumeById,

  getMyResume,
  getResumes
}
from "../controllers/resumeController.js";

const router = express.Router();

router.get("/", protect, getResumes);  // ← add this
=======
  uploadResume,
  analyzeResume,
  getMyResume,
  getResumeById,
  matchResume,
  rewriteBullets,
  generateMockInterview,
  optimizeResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// Get latest resume of logged in user
router.get(
  "/my",
  protect,
  getMyResume
);

// Get resume by id
router.get(
  "/:id",
  protect,
  getResumeById
);

>>>>>>> d0c9718 (feat:updated)
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

<<<<<<< HEAD
router.get(
  "/:id",
  protect,
  getResumeById
);
=======
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

>>>>>>> d0c9718 (feat:updated)
export default router;