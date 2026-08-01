"use client";
import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link href="/dashboard/resume">
        <a className="glass p-6 rounded-lg hover:scale-105 transition transform">
          <h2 className="text-xl font-semibold">ATS Resume Analyzer</h2>
          <p className="text-sm text-gray-300 mt-2">Upload your resume and get an ATS score, keyword suggestions, and improvements.</p>
        </a>
      </Link>

      <div className="glass p-6 rounded-lg opacity-80">
        <h2 className="text-xl font-semibold">AI Mock Interview</h2>
        <p className="text-sm text-gray-300 mt-2">Coming soon</p>
      </div>

      <div className="glass p-6 rounded-lg opacity-80">
        <h2 className="text-xl font-semibold">Coding Practice</h2>
        <p className="text-sm text-gray-300 mt-2">Coming soon</p>
      </div>
    </div>
  );
}
