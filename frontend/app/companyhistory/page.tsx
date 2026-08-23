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
  createdAt: string;
}

export default function CompanyInterviewHistoryPage() {
  const [interviews, setInterviews] = useState<CompanyInterview[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [rounds, setRounds] = useState<string[]>([]);

  const [companyFilter, setCompanyFilter] = useState("");
  const [roundFilter, setRoundFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        }
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchOptions();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (companyFilter) params.set("company", companyFilter);
      if (roundFilter) params.set("round", roundFilter);

      const res = await fetch(
        `${BACKEND_URL}/api/company-interview/history?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to load history.");
        return;
      }
      setInterviews(data.interviews);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch history. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyFilter, roundFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Interview History</h1>
        <p className="text-slate-400 mb-6">Your past company-wise interview attempts.</p>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Rounds</option>
            {rounds.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Loading history...</p>
        ) : interviews.length === 0 ? (
          <p className="text-slate-500">No interviews found. Start one to see it here.</p>
        ) : (
          <div className="space-y-3">
            {interviews.map((iv) => (
              <div
                key={iv._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex justify-between items-center"
              >
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="bg-blue-900/40 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                      {iv.company}
                    </span>
                    <span className="bg-purple-900/40 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                      {iv.role}
                    </span>
                    <span className="bg-emerald-900/40 text-emerald-300 text-xs px-2 py-0.5 rounded-full">
                      {iv.round}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    {new Date(iv.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {iv.score > 0 ? `${iv.score}/100` : "—"}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {iv.score > 0 ? "Completed" : "Not submitted"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
