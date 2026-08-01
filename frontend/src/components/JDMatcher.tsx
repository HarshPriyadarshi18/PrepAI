"use client";
import React, { useState } from 'react';
import { api } from '../lib/api';

type MatchResult = {
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
};

export default function JDMatcher({ resumeText }: { resumeText?: string }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleMatch() {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/resumes/match', {
        jobDescription,
        resumeText,
      });
      setResult(res.data?.match || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Matching failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass p-6 rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">AI Job Description Matcher</h3>
        <p className="text-sm text-gray-300">Compare your resume against a target job description and see what you are missing.</p>
      </div>

      <textarea
        className="w-full min-h-[140px] rounded border border-gray-700 bg-transparent p-3"
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button className="rounded bg-indigo-600 px-4 py-2" onClick={handleMatch} disabled={loading}>
        {loading ? 'Matching…' : 'Match Resume'}
      </button>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {result && (
        <div className="space-y-3 rounded border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Match Score</span>
            <span className="text-xl font-bold text-indigo-400">{result.matchScore ?? 0}%</span>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Matched Skills</h4>
            <div className="flex flex-wrap gap-2">
              {(result.matchedSkills || []).map((skill) => (
                <span key={skill} className="rounded bg-emerald-600/20 px-2 py-1 text-sm text-emerald-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Missing Skills</h4>
            <ul className="ml-5 list-disc text-sm text-gray-300">
              {(result.missingSkills || []).length ? (
                result.missingSkills!.map((skill) => <li key={skill}>{skill}</li>)
              ) : (
                <li>No major gaps found.</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Suggestions</h4>
            <ul className="ml-5 list-disc text-sm text-gray-300">
              {(result.suggestions || []).length ? (
                result.suggestions!.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>Strengthen your impact statements with measurable results.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
