import React from 'react';
import './styles/globals.css';
import Navbar from '../../components/Navbar';

export const metadata = {
  title: 'PrepAI',
  description: 'Resume ATS analyzer and interview prep',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-slate-100 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
