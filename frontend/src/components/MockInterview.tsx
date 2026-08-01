"use client";
import React, { useState } from 'react';
import { api } from '../lib/api';

type InterviewResult = {
  technicalQuestions?: string[];
  hrQuestions?: string[];
  projectQuestions?: string[];
  feedback?: string[];
};

export default function MockInterview({ resumeText }: { resumeText?: string }) {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!role.trim()) {
      setError('Enter a target role first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/resumes/mock-interview', { role, resumeText });
      setResult(res.data?.result || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Interview generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass p-6 rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">AI Mock Interview</h3>
        <p className="text-sm text-gray-300">Generate technical, HR, and project-based questions for your target role.</p>
      </div>

      <input
        className="w-full rounded border border-gray-700 bg-transparent p-3"
        placeholder="e.g. Full Stack Developer"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button className="rounded bg-amber-600 px-4 py-2" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating…' : 'Generate Interview'}
      </button>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {result && (
        <div className="space-y-4 rounded border border-gray-700 p-4 text-sm text-gray-300">
          <div>
            <h4 className="mb-2 font-medium">Technical Questions</h4>
            <ul className="ml-5 list-disc">
              {(result.technicalQuestions || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">HR Questions</h4>
            <ul className="ml-5 list-disc">
              {(result.hrQuestions || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Project Questions</h4>
            <ul className="ml-5 list-disc">
              {(result.projectQuestions || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Feedback</h4>
            <ul className="ml-5 list-disc">
              {(result.feedback || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
