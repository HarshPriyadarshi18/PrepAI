"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Analytics {
  totalInterviews: number;
  averageScore: string;
  highestScore: number;
  latestScore: number;
}

interface Interview {
  _id: string;
  role: string;
  score: number;
  createdAt: string;
}

export default function InterviewAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [history, setHistory] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, historyRes] = await Promise.all([
        api.get("/interviews/analytics"),
        api.get("/interviews/history"),
      ]);

      setAnalytics(analyticsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl font-semibold text-slate-700">
          Loading Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Interview Analytics
          </h1>

          <p className="text-slate-600 mt-2">
            Track your mock interview performance and progress.
          </p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border">
              <p className="text-slate-500 text-sm">
                Total Interviews
              </p>

              <h2 className="text-4xl font-bold text-slate-900 mt-2">
                {analytics.totalInterviews}
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border">
              <p className="text-slate-500 text-sm">
                Average Score
              </p>

              <h2 className="text-4xl font-bold text-green-600 mt-2">
                {analytics.averageScore}
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border">
              <p className="text-slate-500 text-sm">
                Highest Score
              </p>

              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {analytics.highestScore}
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border">
              <p className="text-slate-500 text-sm">
                Latest Score
              </p>

              <h2 className="text-4xl font-bold text-purple-600 mt-2">
                {analytics.latestScore}
              </h2>
            </div>
          </div>
        )}

        {/* Interview History */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Interview History
          </h2>

          {history.length === 0 ? (
            <p className="text-slate-500">
              No interview history found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left p-4 text-slate-700">
                      Role
                    </th>

                    <th className="text-left p-4 text-slate-700">
                      Score
                    </th>

                    <th className="text-left p-4 text-slate-700">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-4 text-slate-900">
                        {item.role}
                      </td>

                      <td className="p-4 text-blue-600 font-semibold">
                        {item.score}/100
                      </td>

                      <td className="p-4 text-slate-600">
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}