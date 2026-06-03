import groq from "../config/groq.js";

export const analyzeResumeATS = async (resumeText) => {

  const prompt = `
Analyze this resume and return ONLY valid JSON.

Format:

{
  "atsScore": 0,
  "missingKeywords": [],
  "weakBulletPoints": [],
  "formattingSuggestions": [],
  "projectSuggestions": []
}

Resume:
${resumeText}
`;

  const completion =
    await groq.chat.completions.create({
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