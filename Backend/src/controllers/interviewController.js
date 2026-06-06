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

		let result;
		try {
			result = JSON.parse(text);
		} catch (err) {
			// fallback simple scoring
			result = { score: 50, feedback: "Model returned invalid JSON; partial grading applied." };
		}

		interview.score = typeof result.score === "number" ? result.score : 0;
		interview.feedback = result.feedback || "";

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