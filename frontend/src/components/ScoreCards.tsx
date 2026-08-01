"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ScoreCards({ atsScore }: { atsScore: number }) {
  const data = [
    { name: 'Score', value: Math.max(0, Math.min(100, atsScore)) },
    { name: 'Remaining', value: Math.max(0, 100 - atsScore) },
  ];

  const COLORS = ['#60A5FA', '#111827'];

  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">ATS Score</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <div className="text-3xl font-bold">{atsScore ?? 0}%</div>
        <div className="text-sm text-gray-300">Estimated ATS compatibility</div>
      </div>
    </div>
  );
}
