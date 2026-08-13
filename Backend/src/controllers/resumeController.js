import Resume from "../models/Resume.js";
import extractTextFromPDF from "../utils/pdfParser.js";
import { analyzeResumeATS } from "../services/atsService.js";
import {
  matchResumeToJob,
  rewriteBulletPoints,
  generateMockInterviewQuestions,
  optimizeResumeContent,
} from "../services/aiService.js";

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

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
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

export const matchResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findById(resumeId || req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const result = await matchResumeToJob(resume.extractedText, jobDescription || "");

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rewriteBullets = async (req, res) => {
  try {
    const { bullet } = req.body;
    if (!bullet) {
      return res.status(400).json({
        success: false,
        message: "Bullet is required",
      });
    }

    const result = await rewriteBulletPoints(bullet);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateMockInterview = async (req, res) => {
  try {
    const { resumeId, role } = req.body;
    const resume = await Resume.findById(resumeId || req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const result = await generateMockInterviewQuestions(resume.extractedText, role || "");

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const optimizeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findById(resumeId || req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const result = await optimizeResumeContent(resume.extractedText, jobDescription || "");

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const buildAnalyticsSummary = (analysis) => {
  if (!analysis) return {};

  return {
    atsScore: analysis.atsScore,
    missingKeywords: analysis.missingKeywords || [],
    weakBulletPoints: analysis.weakBulletPoints || [],
    formattingSuggestions: analysis.formattingSuggestions || [],
    projectSuggestions: analysis.projectSuggestions || [],
  };
};