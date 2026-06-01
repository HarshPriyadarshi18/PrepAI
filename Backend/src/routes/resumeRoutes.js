import express from "express";

import { protect }
from "../middleware/authmiddleware.js";

import upload
from "../middleware/uploadMiddleware.js";

import {
  uploadResume
}
from "../controllers/resumeController.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

export default router;