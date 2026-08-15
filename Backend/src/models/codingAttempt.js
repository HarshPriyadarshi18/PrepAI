import mongoose from "mongoose";

const codingAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionTitle: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    codingScore: { type: Number, default: 0 }, // out of 10
    passed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    followUp1: {
      question: String,
      answer: String,
      score: Number,
      feedback: String,
    },
    followUp2: {
      question: String,
      answer: String,
      score: Number,
      feedback: String,
    },
    overallScore: { type: Number, default: 0 }, // average of all 3, out of 10
  },
  { timestamps: true }
);

export default mongoose.model("CodingAttempt", codingAttemptSchema);