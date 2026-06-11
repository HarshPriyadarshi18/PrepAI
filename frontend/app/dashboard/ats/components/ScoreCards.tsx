"use client";

import React from "react";

type Props = {
  atsScore: number;
};

export default function ScoreCards({ atsScore }: Props) {
  const cards = [
    { title: "ATS Score", value: `${atsScore || 0}/100`, tone: "green" },
    { title: "Keyword Match", value: "72%", tone: "blue" },
    { title: "Experience Fit", value: "85%", tone: "violet" },
    { title: "Formatting", value: "78%", tone: "amber" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white/80 dark:bg-slate-800 dark:border-slate-700 border p-4 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {c.title}
              </h4>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {c.value}
              </div>
            </div>

            <div className="text-3xl opacity-80">{i === 0 ? "🚀" : i === 1 ? "🔎" : i === 2 ? "💼" : "🧾"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
