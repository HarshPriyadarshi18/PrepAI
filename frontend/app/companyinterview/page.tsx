"use client";

import { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface CompanyInterview {
  _id: string;
  company: string;
  role: string;
  round: string;
  questions: string[];
  answers: string[];
  score: number;
  feedback: string;
}

export default function CompanyInterviewPage() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [rounds, setRounds] = useState<string[]>([]);

  const [company, setCompany] = useState("Amazon");
  const [role, setRole] = useState("");
  const [round, setRound] = useState("Technical1");

  const [interview, setInterview] = useState<CompanyInterview | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch companies + rounds list on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/api/company-interview/options`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setCompanies(data.companies);
          setRounds(data.rounds);
          if (data.companies.length > 0) setCompany(data.companies[0]);
          if (data.rounds.length > 0) setRound(data.rounds[0]);
        }
      } catch (err) {
        console.error("Failed to load options", err);
        setError("Could not load companies/rounds. Is the backend running?");
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleStartInterview = async () => {
    if (!role.trim()) {
      setError("Please enter a role.");
      return;
    }
    setError("");
    setStarting(true);
    setInterview(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/company-interview/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ company, role, round }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to start interview.");
        return;
      }

      setInterview(data.interview);
      setAnswers(new Array(data.interview.questions.length).fill(""));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch. Check backend connection.");
    } finally {
      setStarting(false);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmitAnswers = async () => {
    if (!interview) return;
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/api/company-interview/${interview._id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to submit answers.");
        return;
      }

      setInterview(data.interview);
    } catch (err) {
      console.error(err);
      setError("Failed to submit. Check backend connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Company Interview Prep</h1>
        <p className="text-slate-400 mb-6">
          Practice interview questions tailored to a specific company and round.
        </p>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Selection form — hidden once interview has started */}
        {!interview && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Company</label>
              {loadingOptions ? (
                <p className="text-slate-500 text-sm">Loading companies...</p>
              ) : (
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
                >
                  {companies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Role</label>
              <input
                type="text"
                placeholder="e.g. SDE-1, Backend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Round</label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              >
                {rounds.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={starting || loadingOptions}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
            >
              {starting ? "Generating questions..." : "Start Interview"}
            </button>
          </div>
        )}

        {/* Interview questions + answers */}
        {interview && (
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              <span className="bg-blue-900/40 text-blue-300 text-xs px-3 py-1 rounded-full">
                {interview.company}
              </span>
              <span className="bg-purple-900/40 text-purple-300 text-xs px-3 py-1 rounded-full">
                {interview.role}
              </span>
              <span className="bg-emerald-900/40 text-emerald-300 text-xs px-3 py-1 rounded-full">
                {interview.round}
              </span>
            </div>

            {interview.score > 0 || interview.feedback ? (
              // Result view — after grading
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Score</p>
                  <p className="text-3xl font-bold">{interview.score}/100</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Feedback</p>
                  <p className="text-slate-200">{interview.feedback}</p>
                </div>
                <button
                  onClick={() => {
                    setInterview(null);
                    setAnswers([]);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm"
                >
                  Start Another Interview
                </button>
              </div>
            ) : (
              // Answering view
              <div className="space-y-4">
                {interview.questions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                  >
                    <p className="font-medium mb-3">
                      Q{i + 1}. {q}
                    </p>
                    <textarea
                      value={answers[i] || ""}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      placeholder="Type your answer..."
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                ))}

                <button
                  onClick={handleSubmitAnswers}
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
                >
                  {submitting ? "Grading..." : "Submit Answers"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
