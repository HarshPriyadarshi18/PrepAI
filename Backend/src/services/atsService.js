import groq from "../config/groq.js";

export const analyzeResumeATS = async (resumeText) => {

  const prompt = `Analyze this resume and return ONLY valid JSON.\n\nRespond with a single JSON object and nothing else. Do NOT include backticks or prose.\n\nSchema (exact keys):\n{\n  "atsScore": 0, // integer 0-100\n  "missingKeywords": [],\n  "weakBulletPoints": [],\n  "formattingSuggestions": [],\n  "projectSuggestions": []\n}\n\nGive a numeric "atsScore" between 0 and 100 (integer).\n\nResume:\n${resumeText}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0].message.content;
};

// Simple fallback scorer used when the model output is missing or invalid.
export const computeFallbackScore = (resumeText) => {
  if (!resumeText || typeof resumeText !== "string") return 40;
  const text = resumeText.toLowerCase();

  let score = 50;

  const sections = ["experience", "education", "skills", "projects", "certificat", "summary", "contact"];
  let foundSections = 0;
  for (const s of sections) if (text.includes(s)) foundSections++;
  score += Math.min(30, foundSections * 6); // up to +30

  const keywords = ["javascript","react","node","python","sql","aws","docker","kubernetes","java","c++"];
  let keywordMatches = 0;
  for (const k of keywords) if (text.includes(k)) keywordMatches++;
  score += Math.min(10, keywordMatches * 1);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 400) score += 5;
  if (wordCount < 150) score -= 10;

  // clamp
  if (score < 0) score = 0;
  if (score > 100) score = 100;
  return Math.round(score);
};