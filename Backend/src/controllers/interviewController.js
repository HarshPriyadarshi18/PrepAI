import Interview from "../models/Interview.js";
import groq from "../config/groq.js";

export const startInterview = async(req,res)=>{

try{

const { role } = req.body;

if (!role) {
	return res.status(400).json({ success: false, message: "role is required" });
}

const completion =
await groq.chat.completions.create({

messages:[
{
role:"user",
content:`
Generate exactly 5 interview questions
for ${role}.

Return ONLY JSON array.

Example:
[
"question1",
"question2"
]
`
}
],

model:"llama-3.3-70b-versatile"

});

const text =
completion.choices[0].message.content;

const questions =
JSON.parse(text);

const interview =
await Interview.create({

user:req.user._id,
role,
questions

});

res.status(201).json({
success:true,
interview
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}
};

export const submitAnswers = async (req, res) => {
	try {
		const { answers } = req.body;
		const { id } = req.params;

		const interview = await Interview.findById(id);
		if (!interview) {
			return res.status(404).json({ success: false, message: "Interview not found" });
		}
		if (interview.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: "Not authorized" });
		}

		interview.answers = answers;

		// Ask the model to grade answers and provide feedback as JSON
		const prompt = `You are an interviewer. Given the questions and candidate answers below, return a single JSON object (no prose) with keys:\n{\n  "score": 0,        // integer 0-100 overall score\n  "feedback": ""    // concise feedback string\n}\n\nQuestions:\n${JSON.stringify(interview.questions, null, 2)}\n\nAnswers:\n${JSON.stringify(answers, null, 2)}`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			model: "llama-3.3-70b-versatile",
		});

		const text = completion.choices[0].message.content;

		// Helper: try to extract JSON from a model response
		const extractJson = (str) => {
			if (!str || typeof str !== "string") return null;
			// Look for ```json ... ``` or ``` ... ``` code fences first
			const fenced = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
			if (fenced && fenced[1]) {
				try { return JSON.parse(fenced[1].trim()); } catch (e) { /* fallthrough */ }
			}

			// Try to find the first JSON object in the text
			const firstObjStart = str.indexOf("{");
			const lastObjEnd = str.lastIndexOf("}");
			if (firstObjStart !== -1 && lastObjEnd !== -1 && lastObjEnd > firstObjStart) {
				const maybe = str.substring(firstObjStart, lastObjEnd + 1);
				try { return JSON.parse(maybe); } catch (e) { /* fallthrough */ }
			}

			// As a last attempt, try to parse the whole string (in case it's valid JSON with whitespace)
			try { return JSON.parse(str); } catch (e) { return null; }
		};

		let result = extractJson(text);

		// If extraction failed, retry the model with a stricter prompt (temperature 0)
		if (!result) {
			const retryPrompt = `Return ONLY a single JSON object (no explanation) with keys:\n{\n  \"score\": 0,\n  \"feedback\": \"\"\n}\n\nQuestions:\n${JSON.stringify(interview.questions, null, 2)}\n\nAnswers:\n${JSON.stringify(answers, null, 2)}`;

			try {
				const retry = await groq.chat.completions.create({
					messages: [{ role: "user", content: retryPrompt }],
					model: "llama-3.3-70b-versatile",
					// lower randomness if supported by provider
					// temperature: 0
				});
				const retryText = retry.choices[0].message.content;
				result = extractJson(retryText);
			} catch (e) {
				result = null;
			}
		}

		// Heuristic fallback: simple completeness-based scoring
		if (!result) {
			const total = Array.isArray(interview.questions) ? interview.questions.length : 0;
			const filled = Array.isArray(answers)
				? answers.filter(a => typeof a === 'string' && a.trim().length > 0).length
				: 0;
			const heuristicScore = total > 0 ? Math.round((filled / total) * 100) : 0;
			result = {
				score: heuristicScore,
				feedback: "Model returned invalid JSON after retry; applied heuristic grading based on completeness."
			};
		}

		interview.score = typeof result.score === "number" ? Math.max(0, Math.min(100, result.score)) : 0;
		interview.feedback = typeof result.feedback === "string" ? result.feedback : "";

		await interview.save();

		res.status(200).json({ success: true, interview });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getResult = async (req, res) => {
	try {
		const { id } = req.params;
		const interview = await Interview.findById(id);
		if (!interview) {
			return res.status(404).json({ success: false, message: "Interview not found" });
		}
		if (interview.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: "Not authorized" });
		}

		res.status(200).json({ success: true, interview });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getAnalytics = async (req, res) => {
  try {
    const user = req.user.id;

    const interviews = await Interview.find({ user });

    const totalInterviews = interviews.length;

    const averageScore =
      totalInterviews > 0
        ? (
            interviews.reduce(
              (sum, interview) => sum + interview.score,
              0
            ) / totalInterviews
          ).toFixed(2)
        : 0;

    const highestScore =
      totalInterviews > 0
        ? Math.max(...interviews.map((i) => i.score))
        : 0;

    const latestScore =
      totalInterviews > 0
        ? interviews[interviews.length - 1].score
        : 0;

    res.status(200).json({
      totalInterviews,
      averageScore,
      highestScore,
      latestScore,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const user = req.user.id;

    const interviews = await Interview.find({ user })
      .sort({ createdAt: -1 });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(
      req.params.id
    );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// NAYA — coding round ke liye AI follow-up question generate karta hai
export const getCodeFollowUp = async (req, res) => {
	try {
		const { question, code, language } = req.body;

		if (!question || !code || !language) {
			return res.status(400).json({ success: false, message: "question, code and language are required" });
		}

		const prompt = `You are a technical interviewer. The candidate solved this problem: "${question}". Their ${language} solution:\n\n${code}\n\nAsk ONE short, specific follow-up question about their approach, time/space complexity, or an edge case they may have missed. Return ONLY the follow-up question as plain text, no JSON, no prose before/after.`;

		const completion = await groq.chat.completions.create({
			messages: [{ role: "user", content: prompt }],
			model: "llama-3.3-70b-versatile",
		});

		const followUp = completion.choices[0].message.content.trim();

		res.status(200).json({ success: true, followUp });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Candidate ke follow-up answer ko grade karta hai
export const gradeFollowUpAnswer = async (req, res) => {
	try {
		const { question, code, language, followUpQuestion, answer } = req.body;

		if (!followUpQuestion || !answer) {
			return res.status(400).json({ success: false, message: "followUpQuestion and answer are required" });
		}

		const prompt = `You are a technical interviewer evaluating a candidate's answer to a follow-up question.

Original coding problem: "${question}"
Candidate's code (${language}):
${code}

Follow-up question asked: "${followUpQuestion}"
Candidate's answer: "${answer}"

Evaluate the answer for technical correctness, depth of understanding, and clarity. Return ONLY a single JSON object (no prose, no markdown fences) with keys:
{
  "score": 0,
  "feedback": ""
}`;

		const completion = await groq.chat.completions.create({
			messages: [{ role: "user", content: prompt }],
			model: "llama-3.3-70b-versatile",
		});

		const text = completion.choices[0].message.content;

		const extractJson = (str) => {
			if (!str || typeof str !== "string") return null;
			const fenced = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
			if (fenced && fenced[1]) {
				try { return JSON.parse(fenced[1].trim()); } catch (e) {}
			}
			const firstObjStart = str.indexOf("{");
			const lastObjEnd = str.lastIndexOf("}");
			if (firstObjStart !== -1 && lastObjEnd !== -1 && lastObjEnd > firstObjStart) {
				const maybe = str.substring(firstObjStart, lastObjEnd + 1);
				try { return JSON.parse(maybe); } catch (e) {}
			}
			try { return JSON.parse(str); } catch (e) { return null; }
		};

		let result = extractJson(text);

		if (!result) {
			result = { score: 0, feedback: "Could not evaluate the answer. Please try again." };
		}

		result.score = typeof result.score === "number" ? Math.max(0, Math.min(10, result.score)) : 0;
		result.feedback = typeof result.feedback === "string" ? result.feedback : "";

		res.status(200).json({ success: true, ...result });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};