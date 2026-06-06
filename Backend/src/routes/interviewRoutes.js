import express from "express";

import {
startInterview,
submitAnswers,
getResult
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

export default router;