import express from "express";
import { runCode } from "../controllers/executeController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, runCode);

export default router;