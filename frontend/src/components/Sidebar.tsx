"use client";
import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64">
      <div className="glass p-4 rounded">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard">
              <a>Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/resume">
              <a>Resume Analyzer</a>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
