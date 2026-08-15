"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000";

interface Attempt {
  _id: string;
  questionTitle: string;
  difficulty: string;
  language: string;
  codingScore: number;
  overallScore: number;
  passed: number;
  total: number;
  followUp1?: { score: number };
  followUp2?: { score: number };
  createdAt: string;
}

interface Analytics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  latestScore: number;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [historyRes, analyticsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/interview/coding-history`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/api/interview/coding-analytics`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const historyData = await historyRes.json();
        const analyticsData = await analyticsRes.json();

        if (!historyRes.ok || !historyData.success) {
          setError(historyData.message || "Failed to load history");
          return;
        }

        setAttempts(historyData.attempts || []);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error(err);
        setError("Failed to connect to backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <p className="text-rose-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Coding Interview History</h1>
        <p className="text-slate-400 text-sm mb-8">Track your progress across all past coding rounds.</p>

        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Total Attempts</p>
              <p className="text-white text-2xl font-bold">{analytics.totalAttempts}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Average Score</p>
              <p className="text-blue-400 text-2xl font-bold">{analytics.averageScore} / 10</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Highest Score</p>
              <p className="text-emerald-400 text-2xl font-bold">{analytics.highestScore} / 10</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Latest Score</p>
              <p className="text-amber-400 text-2xl font-bold">{analytics.latestScore} / 10</p>
            </div>
          </div>
        )}

        {attempts.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-10 text-center">
            <p className="text-slate-400">No coding attempts yet. Solve a question to see your history here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {attempts.map((attempt) => (
              <div
                key={attempt._id}
                className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold">{attempt.questionTitle}</h3>
                    <span className={`text-xs font-bold uppercase ${DIFFICULTY_COLOR[attempt.difficulty]}`}>
                      {attempt.difficulty}
                    </span>
                    <span className="text-slate-500 text-xs uppercase">{attempt.language}</span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      attempt.overallScore >= 7
                        ? "text-emerald-400"
                        : attempt.overallScore >= 4
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {attempt.overallScore} / 10
                  </div>
                </div>

                <p className="text-slate-500 text-xs mb-3">
                  {new Date(attempt.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <div className="flex gap-3 text-xs">
                  <div className="bg-slate-900/40 rounded-lg px-3 py-2">
                    <span className="text-slate-500">Coding: </span>
                    <span className="text-white font-semibold">{attempt.codingScore}/10</span>
                    <span className="text-slate-500"> ({attempt.passed}/{attempt.total} tests)</span>
                  </div>
                  {attempt.followUp1?.score !== undefined && (
                    <div className="bg-slate-900/40 rounded-lg px-3 py-2">
                      <span className="text-slate-500">Follow-up 1: </span>
                      <span className="text-white font-semibold">{attempt.followUp1.score}/10</span>
                    </div>
                  )}
                  {attempt.followUp2?.score !== undefined && (
                    <div className="bg-slate-900/40 rounded-lg px-3 py-2">
                      <span className="text-slate-500">Follow-up 2: </span>
                      <span className="text-white font-semibold">{attempt.followUp2.score}/10</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}