import groq from "../config/groq.js";

const parseStructuredJson = (content) => {
  const cleaned = (content || "{}").replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

export const matchResumeToJob = async (resumeText, jobDescription) => {
  const prompt = `
You are an expert ATS and hiring coach.
Compare the resume text against the job description and return ONLY valid JSON.

Format:
{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "missingKeywords": [],
  "suggestions": []
}

Resume:
${resumeText || "No resume provided"}

Job Description:
${jobDescription}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-20b",
  });

  const content = completion.choices[0].message.content || "{}";
  return parseStructuredJson(content);
};

export const rewriteBulletPoints = async (bullet) => {
  const prompt = `
Rewrite this weak resume bullet point into a stronger ATS-friendly achievement statement in STAR style.
Return ONLY valid JSON:
{
  "rewrittenBullets": []
}

Bullet:
${bullet}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-20b",
  });

  const content = completion.choices[0].message.content || "{}";
  return parseStructuredJson(content);
};

export const generateMockInterviewQuestions = async (resumeText, role) => {
  const prompt = `
You are an expert interview coach.
Create a mock interview plan based on the resume and target role.
Return ONLY valid JSON:
{
  "technicalQuestions": [],
  "hrQuestions": [],
  "projectQuestions": [],
  "feedback": []
}

Resume:
${resumeText || "No resume provided"}

Role:
${role}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-20b",
  });

  return parseStructuredJson(completion.choices[0].message.content);
};

export const optimizeResumeContent = async (resumeText, jobDescription) => {
  const prompt = `
You are an ATS expert.
Rewrite the resume content to be more optimized for the given job description.
Return ONLY valid JSON:
{
  "optimizedResume": "",
  "atsScore": 0,
  "improvedAtsScore": 0,
  "suggestions": []
}

Resume:
${resumeText || "No resume provided"}

Job Description:
${jobDescription || "General optimization"}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-20b",
  });

  return parseStructuredJson(completion.choices[0].message.content);
};
