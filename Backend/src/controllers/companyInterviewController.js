import CompanyInterview from "../models/CompanyInterview.js";
import groq from "../config/groq.js";
import { getCompanyContext, getRoundContext, companyProfiles, roundProfiles } from "../config/interviewProfiles.js";

// Returns list of supported companies + rounds, so frontend can build dropdowns dynamically
export const getCompanyInterviewOptions = async (req, res) => {
	try {
		res.status(200).json({
			success: true,
			companies: Object.keys(companyProfiles),
			rounds: Object.keys(roundProfiles),
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Starts a NEW company + role + round based interview
export const startCompanyInterview = async (req, res) => {
	try {
		const { company, role, round } = req.body;

		if (!company || !role || !round) {
			return res.status(400).json({
				success: false,
				message: "company, role and round are required",
			});
		}

		const companyContext = getCompanyContext(company);
		const roundContext = getRoundContext(round);

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "user",
					content: `
You are simulating a real interview at ${company} for the role of ${role}, specifically the ${round} round.

Company style: ${companyContext}
Round focus: ${roundContext}

Generate exactly 5 interview questions matching this company's style and this round's focus.

Return ONLY JSON array.
Example:
["question1", "question2"]
`,
				},
			],
			model: "openai/gpt-oss-20b",
		});

		const text = completion.choices[0].message.content;
		const questions = JSON.parse(text);

		const interview = await CompanyInterview.create({
			user: req.user._id,
			company,
			role,
			round,
			questions,
		});

		res.status(201).json({ success: true, interview });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Submit answers and get AI grading — same pattern as generic submitAnswers
export const submitCompanyInterviewAnswers = async (req, res) => {
	try {
		const { answers } = req.body;
		const { id } = req.params;

		const interview = await CompanyInterview.findById(id);
		if (!interview) {
			return res.status(404).json({ success: false, message: "Interview not found" });
		}
		if (interview.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: "Not authorized" });
		}

		interview.answers = answers;

		const companyContext = getCompanyContext(interview.company);
		const roundContext = getRoundContext(interview.round);

		const prompt = `You are an interviewer at ${interview.company} conducting a ${interview.round} round for the role of ${interview.role}.
Company style: ${companyContext}
Round focus: ${roundContext}

Given the questions and candidate answers below, return a single JSON object (no prose) with keys:
{
  "score": 0,
  "feedback": ""
}

Questions:
${JSON.stringify(interview.questions, null, 2)}

Answers:
${JSON.stringify(answers, null, 2)}`;

		const completion = await groq.chat.completions.create({
			messages: [{ role: "user", content: prompt }],
			model: "openai/gpt-oss-20b",
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
			const total = Array.isArray(interview.questions) ? interview.questions.length : 0;
			const filled = Array.isArray(answers)
				? answers.filter((a) => typeof a === "string" && a.trim().length > 0).length
				: 0;
			const heuristicScore = total > 0 ? Math.round((filled / total) * 100) : 0;
			result = {
				score: heuristicScore,
				feedback: "Model returned invalid JSON; applied heuristic grading based on completeness.",
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

// History — with optional company/round filters
export const getCompanyInterviewHistory = async (req, res) => {
	try {
		const { company, round } = req.query;
		const filter = { user: req.user._id };
		if (company) filter.company = company;
		if (round) filter.round = round;

		const interviews = await CompanyInterview.find(filter).sort({ createdAt: -1 });
		res.status(200).json({ success: true, interviews });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Single interview result
export const getCompanyInterviewResult = async (req, res) => {
	try {
		const { id } = req.params;
		const interview = await CompanyInterview.findById(id);
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

// Analytics scoped to company interviews, optionally filtered by company
export const getCompanyInterviewAnalytics = async (req, res) => {
	try {
		const { company } = req.query;
		const filter = { user: req.user._id };
		if (company) filter.company = company;

		const interviews = await CompanyInterview.find(filter);

		const totalInterviews = interviews.length;
		const averageScore =
			totalInterviews > 0
				? (interviews.reduce((sum, i) => sum + i.score, 0) / totalInterviews).toFixed(2)
				: 0;
		const highestScore = totalInterviews > 0 ? Math.max(...interviews.map((i) => i.score)) : 0;
		const latestScore = totalInterviews > 0 ? interviews[0].score : 0;

		res.status(200).json({
			success: true,
			totalInterviews,
			averageScore,
			highestScore,
			latestScore,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};