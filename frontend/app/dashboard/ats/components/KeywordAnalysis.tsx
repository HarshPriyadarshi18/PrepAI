"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type Props = {
  keywords?: { keyword: string; count: number; relevance?: number }[];
};

export default function KeywordAnalysis({ keywords = [] }: Props) {
  const data = keywords.map((k) => ({ name: k.keyword, value: k.count }));

  const colors = ["#3b82f6", "#60a5fa", "#7dd3fc", "#34d399"];

  return (
    <div className="bg-white/90 dark:bg-slate-800 rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Keyword Analysis
      </h3>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 10 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300">
        {keywords.slice(0, 8).map((k, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
            <div className="flex-1 truncate">{k.keyword}</div>
            <div className="font-medium">{k.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
