"use client";

import React from "react";

type Props = {
  suggestions?: {
    title: string;
    details: string[];
    severity?: "low" | "medium" | "high";
  }[];
};

export default function ImprovementSuggestions({ suggestions = [] }: Props) {
  return (
    <div className="bg-white/90 dark:bg-slate-800 rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Improvement Suggestions
      </h3>

      <div className="space-y-4">
        {suggestions.map((s, i) => (
          <div key={i} className="border rounded-lg p-3 dark:border-slate-700 bg-white dark:bg-slate-900/50">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">{s.title}</h4>
              <span className="text-sm text-slate-500 dark:text-slate-300">{s.severity || "medium"}</span>
            </div>

            <ul className="mt-2 list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
              {s.details.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
