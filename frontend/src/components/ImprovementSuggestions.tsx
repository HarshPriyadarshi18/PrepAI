"use client";
import React from 'react';

export default function ImprovementSuggestions({
  weakBullets,
  formatting,
  projects,
}: {
  weakBullets: string[];
  formatting: string[];
  projects: string[];
}) {
  return (
    <div className="glass p-6 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Improvement Suggestions</h3>
      <div>
        <h4 className="font-medium">Weak Bullet Points</h4>
        <ul className="list-disc ml-5 text-sm text-gray-300">
          {weakBullets.length ? weakBullets.map((b, i) => <li key={i}>{b}</li>) : <li>Looks good</li>}
        </ul>
      </div>

      <div>
        <h4 className="font-medium">Formatting</h4>
        <ul className="list-disc ml-5 text-sm text-gray-300">
          {formatting.length ? formatting.map((f, i) => <li key={i}>{f}</li>) : <li>No major issues</li>}
        </ul>
      </div>

      <div>
        <h4 className="font-medium">Project Suggestions</h4>
        <ul className="list-disc ml-5 text-sm text-gray-300">
          {projects.length ? projects.map((p, i) => <li key={i}>{p}</li>) : <li>Consider adding measurable impact metrics</li>}
        </ul>
      </div>
    </div>
  );
}
