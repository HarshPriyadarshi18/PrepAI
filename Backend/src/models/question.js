const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  category: { type: String },
  description: { type: String, required: true },
  examples: [
    {
      input: String,
      output: String,
    },
  ],
  constraints: [String],
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
});

module.exports = mongoose.model("Question", questionSchema);