"use client";
import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import ScoreCards from '../../../components/ScoreCards';
import KeywordAnalysis from '../../../components/KeywordAnalysis';
import ImprovementSuggestions from '../../../components/ImprovementSuggestions';
import JDMatcher from '../../../components/JDMatcher';
import BulletRewriter from '../../../components/BulletRewriter';
import AnalyticsDashboard from '../../../components/AnalyticsDashboard';
import MockInterview from '../../../components/MockInterview';
import ResumeOptimizer from '../../../components/ResumeOptimizer';

type ResumeData = {
  id: string;
  atsScore?: number;
  keywords?: { keyword: string; found: boolean }[];
  weakBullets?: string[];
  formatting?: string[];
  projects?: string[];
  extractedText?: string;
  analytics?: {
    atsScore?: number;
    skillsScore?: number;
    projectsScore?: number;
    experienceScore?: number;
    formattingScore?: number;
    readabilityScore?: number;
    keywordCoverage?: number;
  };
};

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadAndAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('resume', file);
      const up = await api.post('/resumes/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const id = up.data?.id || up.data?.resumeId;
      if (!id) throw new Error('Upload failed to return id');
      await api.post(`/resumes/analyze/${id}`);
      await fetchLatest();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function fetchLatest() {
    try {
      const res = await api.get('/resumes/my');
      const data = res.data?.resume || res.data;
      if (data) {
        setResume({
          id: data._id || data.id,
          atsScore: data.atsAnalysis?.atsScore,
          keywords: data.atsAnalysis?.missingKeywords?.map((keyword: string) => ({ keyword, found: false })) || [],
          weakBullets: data.atsAnalysis?.weakBulletPoints || [],
          formatting: data.atsAnalysis?.formattingSuggestions || [],
          projects: data.atsAnalysis?.projectSuggestions || [],
          extractedText: data.extractedText,
          analytics: data.analytics || null,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch resumes');
    }
  }

  useEffect(() => {
    fetchLatest();
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Upload Resume (PDF)</h2>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div className="mt-4">
          <button className="px-4 py-2 bg-indigo-600 rounded" onClick={uploadAndAnalyze} disabled={!file || loading}>
            {loading ? 'Uploading…' : 'Upload & Analyze'}
          </button>
        </div>
      </div>

      {resume ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ScoreCards atsScore={resume.atsScore ?? 0} />
              <KeywordAnalysis keywords={resume.keywords || []} />
            </div>
            <div>
              <ImprovementSuggestions
                weakBullets={resume.weakBullets || []}
                formatting={resume.formatting || []}
                projects={resume.projects || []}
              />
            </div>
          </div>

          <AnalyticsDashboard summary={resume.analytics} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <JDMatcher resumeText={resume.extractedText} />
            <BulletRewriter />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MockInterview resumeText={resume.extractedText} />
            <ResumeOptimizer resumeText={resume.extractedText} />
          </div>
        </div>
      ) : (
        <div className="glass p-6 rounded">No resume analyzed yet.</div>
      )}
    </div>
  );
}
