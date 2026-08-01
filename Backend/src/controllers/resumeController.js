import Resume from "../models/Resume.js";
import extractTextFromPDF from "../utils/pdfParser.js";
import { analyzeResumeATS } from "../services/atsService.js";

export const uploadResume = async (req, res) => {
  try {
    const text = await extractTextFromPDF(req.file.path);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.filename,
      fileUrl: req.file.path,
      extractedText: text,
    });

    res.status(201).json({
      success: true,
      extractedCharacters: text.length,
      id: resume._id,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const result = await analyzeResumeATS(
      resume.extractedText
    );

    const cleanedResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(
      cleanedResult
    );

    resume.atsAnalysis = analysis;
    await resume.save();

    res.status(200).json({
      success: true,
      atsAnalysis: analysis,
      analytics: buildAnalyticsSummary(analysis),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};