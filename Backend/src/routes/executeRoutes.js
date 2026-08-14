import express from "express";
import { runCode, submitCode } from "../controllers/executeController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, runCode);
router.post("/submit", protect, submitCode);

export default router;