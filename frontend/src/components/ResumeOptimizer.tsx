"use client";
import React, { useState } from 'react';
import { api } from '../lib/api';

type OptimizerResult = {
  optimizedResume?: string;
  atsScore?: number;
  improvedAtsScore?: number;
  suggestions?: string[];
};

export default function ResumeOptimizer({ resumeText }: { resumeText?: string }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOptimize() {
    if (!resumeText) {
      setError('Upload a resume first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/resumes/optimize', { resumeText, jobDescription });
      setResult(res.data?.result || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Optimization failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass p-6 rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">One-Click Resume Optimizer</h3>
        <p className="text-sm text-gray-300">Rewrite your resume content, add ATS keywords, and see an expected score bump.</p>
      </div>

      <textarea
        className="w-full min-h-[120px] rounded border border-gray-700 bg-transparent p-3"
        placeholder="Paste a job description here to tailor your resume"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button className="rounded bg-emerald-600 px-4 py-2" onClick={handleOptimize} disabled={loading}>
        {loading ? 'Optimizing…' : 'Optimize Resume'}
      </button>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {result && (
        <div className="space-y-4 rounded border border-gray-700 p-4 text-sm text-gray-300">
          <div className="flex items-center justify-between">
            <span>Current ATS Score</span>
            <span className="font-semibold text-indigo-300">{result.atsScore ?? 0}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Improved ATS Score</span>
            <span className="font-semibold text-emerald-300">{result.improvedAtsScore ?? 0}%</span>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Optimized Resume Preview</h4>
            <p className="whitespace-pre-wrap text-sm text-gray-300">{result.optimizedResume || 'No preview available.'}</p>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Suggestions</h4>
            <ul className="ml-5 list-disc">
              {(result.suggestions || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
