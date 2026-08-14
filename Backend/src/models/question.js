import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    category: { type: String, default: "general" },
    description: { type: String, required: true },
    examples: [
      {
        input: String,
        output: String,
      },
    ],
    constraints: [String],
    starterCode: {
      cpp: String,
      python: String,
      java: String,
    },
    testCases: [
      {
        input: { type: String, default: "" },
        expectedOutput: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);