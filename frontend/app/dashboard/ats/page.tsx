"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import ScoreCards from "./components/ScoreCards";
import KeywordAnalysis from "./components/KeywordAnalysis";
import ImprovementSuggestions from "./components/ImprovementSuggestions";

interface AtsAnalysis {
  atsScore: number;
  keywordCounts?: Record<string, number>;
  missingKeywords?: string[];
  formattingSuggestions?: string[];
  weakBulletPoints?: string[];
  projectSuggestions?: string[];
  keywordScore?: number;
  projectScore?: number;
  formattingScore?: number;
  experienceScore?: number;
}

interface Resume {
  _id: string;
  atsAnalysis?: AtsAnalysis;
}

export default function ATSDashboard() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get("/resumes/my");
        let fetched: Resume = res.data.resume;

        if (fetched && !fetched.atsAnalysis) {
          await api.post(`/resumes/analyze/${fetched._id}`);
          const updated = await api.get("/resumes/my");
          fetched = updated.data.resume;
        }

        setResume(fetched);
      } catch (err: unknown) {
        setError("Failed to load resume. Please try again.");
        console.error("Resume fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        No resume found
      </div>
    );
  }

  const atsData = resume.atsAnalysis;

  const pieData = [
    { name: "Score", value: atsData?.atsScore || 0 },
    { name: "Remaining", value: 100 - (atsData?.atsScore || 0) },
  ];

  const scoreBreakdown = [
    {
      name: "Keywords",
      score:
        atsData?.keywordScore ??
        Math.max(0, 100 - (atsData?.missingKeywords?.length || 0) * 10),
    },
    {
      name: "Projects",
      score:
        atsData?.projectScore ??
        Math.max(0, 100 - (atsData?.projectSuggestions?.length || 0) * 10),
    },
    {
      name: "Formatting",
      score:
        atsData?.formattingScore ??
        Math.max(0, 100 - (atsData?.formattingSuggestions?.length || 0) * 15),
    },
    {
      name: "Experience",
      score:
        atsData?.experienceScore ??
        Math.max(0, 100 - (atsData?.weakBulletPoints?.length || 0) * 10),
    },
  ];

  const keywords = atsData?.keywordCounts
    ? Object.entries(atsData.keywordCounts).map(([k, v]) => ({
        keyword: k,
        count: Number(v),
      }))
    : (atsData?.missingKeywords || []).map((keyword: string) => ({
        keyword,
        count: 1,
      }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-6">
      <h1 className="text-4xl font-bold mb-2">Resume ATS Analysis</h1>
      <p className="text-gray-600 mb-8">
        AI-powered resume evaluation and improvement suggestions.
      </p>

      <div className="mb-8">
        <ScoreCards atsScore={atsData?.atsScore || 0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">ATS Overview</h2>

            <div className="flex items-center gap-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={56}
                      outerRadius={72}
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-green-600">
                  {atsData?.atsScore || 0}
                </h3>
                <p className="text-sm text-gray-500">Overall ATS Score</p>

                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={scoreBreakdown}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <KeywordAnalysis keywords={keywords} />
        </div>

        <div>
          <ImprovementSuggestions
            suggestions={[
              {
                title: "Missing Keywords",
                details: atsData?.missingKeywords || [],
                severity: "high",
              },
              {
                title: "Formatting Tips",
                details: atsData?.formattingSuggestions || [],
                severity: "medium",
              },
              {
                title: "Project Improvements",
                details: [
                  ...(atsData?.weakBulletPoints || []),
                  ...(atsData?.projectSuggestions || []),
                ],
                severity: "medium",
              },
            ]}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-3">Overall Recommendation</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {atsData?.missingKeywords?.length
            ? `Add missing keywords like "${atsData.missingKeywords.slice(0, 3).join('", "')}" to improve ATS compatibility.`
            : "Your resume looks good! Keep it updated with relevant keywords and strong bullet points."}
        </p>
      </div>
    </div>
  );
}