"use client";
import React, { useState } from 'react';
import { api } from '../lib/api';

type RewriterResult = {
  rewrittenBullets?: string[];
};

export default function BulletRewriter() {
  const [bullet, setBullet] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RewriterResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRewrite() {
    if (!bullet.trim()) {
      setError('Enter a weak bullet point first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/resumes/rewrite-bullets', { bullet });
      setResult(res.data?.result || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Rewrite failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass p-6 rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">AI Bullet Rewriter</h3>
        <p className="text-sm text-gray-300">Turn weak bullets into strong STAR-style achievements.</p>
      </div>

      <textarea
        className="w-full min-h-[110px] rounded border border-gray-700 bg-transparent p-3"
        placeholder="Example: Made a website"
        value={bullet}
        onChange={(e) => setBullet(e.target.value)}
      />

      <button className="rounded bg-emerald-600 px-4 py-2" onClick={handleRewrite} disabled={loading}>
        {loading ? 'Rewriting…' : 'Rewrite Bullet'}
      </button>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {result && (
        <div className="rounded border border-gray-700 p-4">
          <h4 className="mb-2 font-medium">Suggested Rewrites</h4>
          <ul className="ml-5 list-disc text-sm text-gray-300">
            {(result.rewrittenBullets || []).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
