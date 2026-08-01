export const parseJsonResponse = (raw) => {
  if (!raw) return {};

  const cleaned = String(raw)
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : cleaned;

  return JSON.parse(candidate);
};

export const buildAnalyticsSummary = (analysis = {}) => {
  const atsScore = Number(analysis.atsScore || 0);
  const missingKeywords = Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords : [];
  const weakBulletPoints = Array.isArray(analysis.weakBulletPoints) ? analysis.weakBulletPoints : [];
  const formattingSuggestions = Array.isArray(analysis.formattingSuggestions) ? analysis.formattingSuggestions : [];
  const projectSuggestions = Array.isArray(analysis.projectSuggestions) ? analysis.projectSuggestions : [];

  const keywordCoverage = Math.max(0, Math.min(100, 100 - missingKeywords.length * 20));
  const skillsScore = Math.max(0, Math.min(100, atsScore - 2));
  const projectsScore = Math.max(0, Math.min(100, 100 - projectSuggestions.length * 30));
  const experienceScore = Math.max(0, Math.min(100, 100 - weakBulletPoints.length * 25));
  const formattingScore = Math.max(0, Math.min(100, 100 - formattingSuggestions.length * 35));
  const readabilityScore = Math.max(0, Math.min(100, 100 - weakBulletPoints.length * 30));

  return {
    atsScore,
    skillsScore,
    projectsScore,
    experienceScore,
    formattingScore,
    readabilityScore,
    keywordCoverage,
  };
};
