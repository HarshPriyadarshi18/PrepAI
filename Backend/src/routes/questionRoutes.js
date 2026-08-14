import express from "express";
import { getRandomQuestion } from "../controllers/questionController.js";
import { protect } from "../middleware/authmiddleware.js";// aapka existing middleware naam use karo

const router = express.Router();

router.get("/random", protect, getRandomQuestion);

export default router;