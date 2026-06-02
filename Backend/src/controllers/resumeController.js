import Resume from "../models/Resume.js";
import extractTextFromPDF from "../utils/pdfParser.js";

export const uploadResume = async (req, res) => {
  try {

    const text = await extractTextFromPDF(
      req.file.path
    );

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.filename,
      fileUrl: req.file.path,
      extractedText: text,
    });

    res.status(201).json({
      success: true,
      extractedCharacters: text.length,
      resume,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};