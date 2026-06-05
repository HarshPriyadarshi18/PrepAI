import Resume from "../models/Resume.js";
import extractTextFromPDF from "../utils/pdfParser.js";
import { analyzeResumeATS, computeFallbackScore } from "../services/atsService.js";

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

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
      message: error.message,
    });
  }
};
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

export const analyzeResume = async (req, res) => {
  try {

    const resume = await Resume.findById(
      req.params.id
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const result = await analyzeResumeATS(resume.extractedText);

    const cleanedResult = (result || "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let analysis = null;
    try {
      analysis = JSON.parse(cleanedResult);
    } catch (e) {
      // parsing failed — create a sensible default using fallback scorer
      const fallbackScore = computeFallbackScore(resume.extractedText);
      analysis = {
        atsScore: fallbackScore,
        missingKeywords: [],
        weakBulletPoints: [],
        formattingSuggestions: [],
        projectSuggestions: [],
      };
    }

    // validate atsScore and ensure fields exist
    if (!analysis || typeof analysis !== "object") {
      const fallbackScore = computeFallbackScore(resume.extractedText);
      analysis = {
        atsScore: fallbackScore,
        missingKeywords: [],
        weakBulletPoints: [],
        formattingSuggestions: [],
        projectSuggestions: [],
      };
    }

    if (typeof analysis.atsScore !== "number" || isNaN(analysis.atsScore)) {
      analysis.atsScore = computeFallbackScore(resume.extractedText);
    }

    // normalize arrays
    analysis.missingKeywords = Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords : [];
    analysis.weakBulletPoints = Array.isArray(analysis.weakBulletPoints) ? analysis.weakBulletPoints : [];
    analysis.formattingSuggestions = Array.isArray(analysis.formattingSuggestions) ? analysis.formattingSuggestions : [];
    analysis.projectSuggestions = Array.isArray(analysis.projectSuggestions) ? analysis.projectSuggestions : [];

    resume.atsAnalysis = analysis;

    await resume.save();

    res.status(200).json({
      success: true,
      atsAnalysis: analysis,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};