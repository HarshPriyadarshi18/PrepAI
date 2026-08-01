"use client";
import React from 'react';

type AnalyticsSummary = {
  atsScore?: number;
  skillsScore?: number;
  projectsScore?: number;
  experienceScore?: number;
  formattingScore?: number;
  readabilityScore?: number;
  keywordCoverage?: number;
};

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-gray-700 bg-gray-900/60 p-4">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-indigo-300">{value}%</div>
    </div>
  );
}

export default function AnalyticsDashboard({ summary }: { summary?: AnalyticsSummary | null }) {
  const data = summary || {};

  return (
    <div className="glass p-6 rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Resume Analytics Dashboard</h3>
        <p className="text-sm text-gray-300">A quick snapshot of how your resume scores across core ATS dimensions.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <MetricCard label="ATS Score" value={data.atsScore ?? 0} />
        <MetricCard label="Skills Score" value={data.skillsScore ?? 0} />
        <MetricCard label="Projects Score" value={data.projectsScore ?? 0} />
        <MetricCard label="Experience Score" value={data.experienceScore ?? 0} />
        <MetricCard label="Formatting Score" value={data.formattingScore ?? 0} />
        <MetricCard label="Readability Score" value={data.readabilityScore ?? 0} />
      </div>

      <div className="rounded border border-gray-700 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">Keyword Coverage</span>
          <span className="text-indigo-300">{data.keywordCoverage ?? 0}%</span>
        </div>
        <div className="h-2 rounded bg-gray-800">
          <div className="h-2 rounded bg-indigo-500" style={{ width: `${Math.max(0, Math.min(100, data.keywordCoverage ?? 0))}%` }} />
        </div>
      </div>
    </div>
  );
}
