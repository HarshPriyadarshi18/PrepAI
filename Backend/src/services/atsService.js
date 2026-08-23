import groq from "../config/groq.js";

// ---------------------------------------------------------------------------
// 1. PROGRAMMATIC STATS EXTRACTION
//    Deterministic, regex-based signals computed BEFORE calling the LLM.
//    These get injected into the prompt so the model's score is grounded
//    in real numbers instead of purely "vibes" from raw text.
// ---------------------------------------------------------------------------
export const extractResumeStats = (resumeText) => {
  const text = resumeText || "";
  const lowerText = text.toLowerCase();

  // --- Quantified achievements: bullet-ish lines containing a number/%/$ ---
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bulletLines = lines.filter((l) => /^[-•*▪●○]|^\d+\.\s/.test(l));
  const linesToScan = bulletLines.length > 0 ? bulletLines : lines;
  const quantifiedPattern = /(\d+%|\$\d+|\d+\+|\d{2,}(?:,\d{3})*|\bx\d+\b|\d+x\b)/i;
  const quantifiedCount = linesToScan.filter((l) => quantifiedPattern.test(l)).length;

  // --- Word count ---
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // --- Contact info detection ---
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /(\+?\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/.test(text);

  // --- Professional links ---
  const hasLinkedIn = /linkedin\.com\/in\//i.test(text);
  const hasGitHub = /github\.com\//i.test(text);
  const hasPortfolio = /(portfolio|behance\.net|dribbble\.com)\b/i.test(text) ||
    /https?:\/\/(?!.*(linkedin|github))[a-z0-9-]+\.[a-z]{2,}/i.test(text);

  // --- Section headers present ---
  const sectionChecks = {
    experience: /\b(experience|employment|work history)\b/i,
    education: /\beducation\b/i,
    skills: /\bskills\b/i,
    projects: /\bprojects?\b/i,
    summary: /\b(summary|objective|profile)\b/i,
    certifications: /\bcertificat/i,
  };
  const sectionsFound = Object.entries(sectionChecks)
    .filter(([, re]) => re.test(text))
    .map(([name]) => name);

  // --- Weak action verb usage (rough heuristic) ---
  const weakVerbs = ["responsible for", "helped with", "worked on", "assisted", "involved in", "duties included"];
  const weakVerbHits = weakVerbs.filter((v) => lowerText.includes(v));

  // --- ATS-unfriendly formatting hints ---
  const hasTableLikeChars = /\t{2,}|\|{2,}/.test(text);
  const hasSpecialChars = /[■◆♦★☆]/.test(text);

  return {
    quantifiedCount,
    totalBullets: linesToScan.length,
    wordCount,
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasGitHub,
    hasPortfolio,
    sectionsFound,
    weakVerbHits,
    hasTableLikeChars,
    hasSpecialChars,
  };
};

// Format the stats object into a compact, readable block for the prompt.
const formatStatsForPrompt = (stats) => `
OBJECTIVE STATS (pre-computed, treat as ground truth — do not re-derive these):
- Quantified achievement bullets: ${stats.quantifiedCount} out of ${stats.totalBullets} total bullets
- Word count: ${stats.wordCount}
- Contact info: email ${stats.hasEmail ? "✓" : "✗ MISSING"}, phone ${stats.hasPhone ? "✓" : "✗ MISSING"}
- Professional links: LinkedIn ${stats.hasLinkedIn ? "✓" : "✗ MISSING"}, GitHub ${stats.hasGitHub ? "✓" : "✗ MISSING"}, Portfolio ${stats.hasPortfolio ? "✓" : "✗ MISSING"}
- Sections detected: ${stats.sectionsFound.length ? stats.sectionsFound.join(", ") : "NONE DETECTED"}
- Weak filler phrases found: ${stats.weakVerbHits.length ? stats.weakVerbHits.join(", ") : "none"}
- Table-like/tab formatting detected: ${stats.hasTableLikeChars ? "YES (ATS risk)" : "no"}
- Unusual special characters detected: ${stats.hasSpecialChars ? "YES (ATS risk)" : "no"}
`.trim();

// ---------------------------------------------------------------------------
// 2. MAIN ANALYZER — hybrid (stats + AI), with optional job description
//    matching, role auto-detection, and priority-ranked suggestions.
// ---------------------------------------------------------------------------
export const analyzeResumeATS = async (resumeText, jobDescription = "") => {
  const stats = extractResumeStats(resumeText);
  const statsBlock = formatStatsForPrompt(stats);

  const jdSection = jobDescription?.trim()
    ? `
TARGET JOB DESCRIPTION (match resume against this specific role — this takes priority over generic keyword checks):
"""
${jobDescription.trim()}
"""
Compare the resume's skills/experience directly against this JD. missingKeywords must reflect terms from THIS job description, not generic industry buzzwords.`
    : `
No job description was provided. Base missingKeywords on standard expectations for the detected role instead.`;

  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze the resume and return ONLY valid JSON.

SCORING CRITERIA (0-100):
- 80-100: Well-formatted, rich keywords, strong action verbs, clear structure
- 60-79: Good keywords, mostly organized, minor formatting issues
- 40-59: Basic structure, few keywords, weak verb usage
- 0-39: Poor formatting, missing keywords, unclear structure

Use the OBJECTIVE STATS below as grounding evidence for your score — don't contradict them. For example, if quantified bullets are low, that should visibly pull the score down; if contact/links are missing, formattingSuggestions must call it out explicitly.

${statsBlock}
${jdSection}

JSON REQUIREMENTS:
- Return ONLY a valid JSON object (no backticks, markdown, or prose)
- Exact keys and structure as specified below
- All arrays should contain 2-4 specific, actionable items
- Every item inside weakBulletPoints, formattingSuggestions, and projectSuggestions must be a SINGLE STRING, formatted exactly as "[Priority] suggestion text" — e.g. "[High] Quantify achievements with numbers and metrics". Priority must be one of High, Medium, Low. Do NOT return objects for these arrays — plain strings only, with the priority tag prefixed inside the string.

RESPONSE SCHEMA:
{
  "atsScore": 0,
  "detectedRole": "e.g. Frontend Developer",
  "jobMatchScore": null,
  "missingKeywords": ["keyword1", "keyword2"],
  "weakBulletPoints": ["[High] improvement1", "[Medium] improvement2"],
  "formattingSuggestions": ["[Medium] suggestion1", "[Low] suggestion2"],
  "projectSuggestions": ["[Low] project_idea1", "[Medium] project_idea2"]
}

ANALYSIS GUIDELINES:
1. detectedRole: infer the resume owner's target role from titles/skills/projects (e.g. "Frontend Developer", "Data Analyst"). If genuinely unclear, use "General".
2. jobMatchScore: if a job description was provided above, give a 0-100 fit score against it; otherwise set this to null.
3. Look for industry keywords (tools, frameworks, methodologies) relevant to the detected role (or the JD, if provided).
4. Identify weak action verbs - suggest stronger alternatives.
5. Check for ATS-unfriendly formatting (tables, headers, special chars) — factor in the stats above.
6. Suggest projects that fill skill gaps for the detected role.
7. priority = "High" for things that block ATS parsing or are clearly missing (e.g. no email, no quantified results); "Medium" for keyword/wording gaps; "Low" for polish/nice-to-haves.
8. Focus on what Applicant Tracking Systems actually parse.

Resume to analyze:
${resumeText}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "openai/gpt-oss-20b",
  });

  const raw = completion.choices[0].message.content;
  return sanitizeSuggestionArrays(raw);
};

// Safety net: if the model ever ignores the "plain string" instruction and
// returns {text, priority} objects anyway, coerce them back into
// "[Priority] text" strings so the DB schema ([String]) never breaks.
const SUGGESTION_FIELDS = ["weakBulletPoints", "formattingSuggestions", "projectSuggestions"];

const toSuggestionString = (item) => {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    const text = item.text ?? item.suggestion ?? item.description ?? JSON.stringify(item);
    const priority = item.priority ?? "Medium";
    return `[${priority}] ${text}`;
  }
  return String(item);
};

const sanitizeSuggestionArrays = (rawContent) => {
  try {
    // Strip accidental markdown fences before parsing, just in case.
    const cleaned = rawContent.replace(/^```json\s*|```$/g, "").trim();
    const parsed = JSON.parse(cleaned);

    for (const field of SUGGESTION_FIELDS) {
      if (Array.isArray(parsed[field])) {
        parsed[field] = parsed[field].map(toSuggestionString);
      }
    }

    return JSON.stringify(parsed);
  } catch (err) {
    // If parsing fails here, return the raw content untouched — the
    // existing downstream JSON-parse/validation error handling will
    // surface the real issue rather than swallowing it silently.
    return rawContent;
  }
};

// ---------------------------------------------------------------------------
// 3. FALLBACK SCORER — now also uses extractResumeStats() so the fallback
//    path stays consistent with the AI path instead of duplicating regexes.
// ---------------------------------------------------------------------------
export const computeFallbackScore = (resumeText) => {
  if (!resumeText || typeof resumeText !== "string") return 40;

  const stats = extractResumeStats(resumeText);
  let score = 50;

  // Sections (up to +30)
  score += Math.min(30, stats.sectionsFound.length * 6);

  // Quantified achievements (up to +10)
  score += Math.min(10, stats.quantifiedCount * 2);

  // Length signal
  if (stats.wordCount > 400) score += 5;
  if (stats.wordCount < 150) score -= 10;

  // Contact & links
  if (!stats.hasEmail) score -= 8;
  if (!stats.hasPhone) score -= 4;
  if (!stats.hasLinkedIn) score -= 3;
  if (!stats.hasGitHub) score -= 2;

  // Formatting risk
  if (stats.hasTableLikeChars) score -= 5;
  if (stats.hasSpecialChars) score -= 3;

  // Weak filler phrases
  score -= Math.min(6, stats.weakVerbHits.length * 2);

  // clamp
  if (score < 0) score = 0;
  if (score > 100) score = 100;
  return Math.round(score);
};