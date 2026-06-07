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