"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState<any>(null);

  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const startInterview = async () => {
    if (!role) {
      alert("Please select a role");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/interviews/start", {
        role,
      });

      setInterview(res.data.interview);

      setAnswers(
        new Array(res.data.interview.questions.length).fill("")
      );

      setScore(null);
      setFeedback("");
    } catch (error) {
      console.error(error);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const submitInterview = async () => {
    try {
      const res = await api.post(
        `/interviews/submit/${interview._id}`,
        {
          answers,
        }
      );

      setScore(res.data.interview.score);
      setFeedback(res.data.interview.feedback);
    } catch (error) {
      console.error(error);
      alert("Failed to submit interview");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            AI Mock Interview
          </h1>

          <p className="text-slate-600 mt-2">
            Practice interviews powered by AI and improve your placement
            preparation.
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Select Interview Role
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-slate-900"
            >
              <option value="">Select Role</option>

              <option value="Full Stack Developer">
                Full Stack Developer
              </option>

              <option value="Frontend Developer">
                Frontend Developer
              </option>

              <option value="Backend Developer">
                Backend Developer
              </option>

              <option value="Data Developer">
                Data Developer
              </option>

              <option value="Data Scientist">
                Data Scientist
              </option>
            </select>

            <button
              onClick={startInterview}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </div>
        </div>

        {/* Questions */}
        {interview && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Interview Questions
            </h2>

            <div className="space-y-6">
              {interview.questions.map(
                (question: string, index: number) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-5"
                  >
                    <p className="font-semibold text-blue-600 mb-2">
                      Question {index + 1}
                    </p>

                    <p className="text-slate-800 mb-4">
                      {question}
                    </p>

                    <textarea
                      rows={4}
                      placeholder="Write your answer here..."
                      value={answers[index] || ""}
                      onChange={(e) => {
                        const updated = [...answers];
                        updated[index] = e.target.value;
                        setAnswers(updated);
                      }}
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )
              )}
            </div>

            <button
              onClick={submitInterview}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Submit Interview
            </button>
          </div>
        )}

        {/* Result */}
        {score !== null && (
          <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Interview Result
            </h2>

            <p className="text-3xl font-bold text-green-600">
              Score: {score}/100
            </p>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">
                Feedback
              </h3>

              <p className="text-slate-700">
                {feedback}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}