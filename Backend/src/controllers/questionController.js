import Question from "../models/Question.js";

export const getRandomQuestion = async (req, res) => {
  try {
    const { difficulty } = req.query;

    if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({ success: false, message: "Valid difficulty (easy/medium/hard) is required" });
    }

    const count = await Question.countDocuments({ difficulty });
    if (count === 0) {
      return res.status(404).json({ success: false, message: "No questions found for this difficulty" });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const question = await Question.findOne({ difficulty }).skip(randomIndex);

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};