"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function KeywordAnalysis({ keywords }: { keywords: { keyword: string; found: boolean }[] }) {
  const data = keywords.map((k) => ({ name: k.keyword, value: k.found ? 1 : 0 }));

  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Keyword Analysis</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={140} />
            <Tooltip />
            <Bar dataKey="value" fill="#60A5FA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
